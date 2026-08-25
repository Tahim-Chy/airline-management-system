import { searchFlights, createBooking } from '../models/bookingModel';
import { getFlightById, decrementAvailableSeats } from '../models/flightModel';
import { calculateDynamicPrice } from '../lib/pricing';

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

    // Sprint 4 integration fix: re-check status server-side, not just in search —
    // covers stale search results or someone calling the API directly.
    if (!BOOKABLE_STATUSES.includes(flight.status)) {
      return res.status(400).json({ error: `This flight is ${flight.status} and can no longer be booked` });
    }

    const count = seat_count || 1;
    if (flight.available_seats < count) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    const { dynamic_price } = calculateDynamicPrice(flight);
    const total_price = dynamic_price * count;

    const bookingId = await createBooking({
      flight_id, passenger_name, passenger_email, passenger_phone, passport_number,
      seat_count: count, total_price,
    });
    await decrementAvailableSeats(flight_id, count);

    res.status(201).json({ message: 'Booking confirmed', bookingId, total_price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Booking failed' });
  }
}
