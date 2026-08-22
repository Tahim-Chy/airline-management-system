import { searchFlights, createBooking } from '../models/bookingModel';
import { getFlightById, decrementAvailableSeats } from '../models/flightModel';
import { calculateDynamicPrice } from '../lib/pricing';

export async function search(req, res) {
  try {
    const { origin, destination, date } = req.query;
    const flights = await searchFlights({ origin, destination, date });
    // Attach the current dynamic price to every search result so passengers
    // see the real price they'll pay before they book.
    const withFares = flights.map((f) => ({
      ...f,
      dynamic_price: calculateDynamicPrice(f).dynamic_price,
    }));
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

    const count = seat_count || 1;
    if (flight.available_seats < count) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    // Sprint 3: charge the current dynamic price, not just the flat base price.
    const { dynamic_price } = calculateDynamicPrice(flight);
    const total_price = dynamic_price * count;

    const bookingId = await createBooking({
      flight_id,
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
