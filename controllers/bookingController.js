import { searchFlights, createBooking, getBookingsForUser, cancelBooking, getBookingById } from '../models/bookingModel';
import { getFlightById, decrementAvailableSeats } from '../models/flightModel';
import { calculateDynamicPrice } from '../lib/pricing';
import { getUserFromRequest } from '../lib/auth';

const BOOKABLE_STATUSES = ['Scheduled', 'Boarding', 'Delayed'];

export async function search(req, res) {
  try {
    const { origin, destination, date } = req.query;
    const flights = await searchFlights({ origin, destination, date });
    const withFares = flights.map((f) => ({ ...f, dynamic_price: calculateDynamicPrice(f).dynamic_price }));
    res.status(200).json(withFares);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Search failed' });
  }
}

export async function book(req, res) {
  try {
    const { flight_id, passenger_name, passenger_email, passenger_phone, passport_number, seat_count } = req.body;

    if (!flight_id || !passenger_name || !passenger_email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const flight = await getFlightById(flight_id);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });

    if (!BOOKABLE_STATUSES.includes(flight.status)) {
      return res.status(400).json({ error: `This flight is ${flight.status} and can no longer be booked` });
    }

    const count = seat_count || 1;
    if (flight.available_seats < count) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    const { dynamic_price } = calculateDynamicPrice(flight);
    const total_price = dynamic_price * count;

    // Optional auth: if the passenger is logged in, link this booking to
    // their account so it shows up in "My Bookings". Guests (no token, or
    // an invalid/expired one) can still book exactly as before.
    const user = getUserFromRequest(req);

    const bookingId = await createBooking({
      flight_id,
      user_id: user?.id || null,
      passenger_name,
      passenger_email,
      passenger_phone,
      passport_number,
      seat_count: count,
      total_price,
    });
    await decrementAvailableSeats(flight_id, count);

    res.status(201).json({ message: 'Booking confirmed', bookingId, total_price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Booking failed' });
  }
}

export async function myBookings(req, res) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'Not logged in' });
    res.status(200).json(await getBookingsForUser(user.id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch your bookings' });
  }
}

// New: passenger self-service cancellation, and a lookup used by the
// cancellation page to show booking details before confirming.
export async function lookupBooking(req, res) {
  try {
    const booking = await getBookingById(req.query.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found — check the Booking ID' });
    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to look up booking' });
  }
}

export async function cancel(req, res) {
  try {
    const booking = await getBookingById(req.query.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found — check the Booking ID' });
    if (booking.booking_status === 'Cancelled') {
      return res.status(400).json({ error: 'This booking is already cancelled' });
    }
    if (!BOOKABLE_STATUSES.includes(booking.flight_status)) {
      return res.status(400).json({ error: `This flight has already ${booking.flight_status.toLowerCase()} — it can no longer be cancelled` });
    }

    await cancelBooking(req.query.id);
    res.status(200).json({ message: 'Booking cancelled — your seats have been released' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
}
