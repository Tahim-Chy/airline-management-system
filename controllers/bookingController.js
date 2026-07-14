import { searchFlights, createBooking } from '../models/bookingModel';
import { getFlightById, decrementAvailableSeats } from '../models/flightModel';

export async function search(req, res) {
  try {
    const { origin, destination, date } = req.query;
    const flights = await searchFlights({ origin, destination, date });
    res.status(200).json(flights);
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

    const total_price = flight.price * count;
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
