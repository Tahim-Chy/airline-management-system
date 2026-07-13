import {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
} from '../models/flightModel';

export async function listFlights(req, res) {
  try {
    const flights = await getAllFlights();
    res.status(200).json(flights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
}

export async function getFlight(req, res) {
  try {
    const flight = await getFlightById(req.query.id);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });
    res.status(200).json(flight);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch flight' });
  }
}

export async function addFlight(req, res) {
  try {
    const { flight_number, origin, destination, departure_time, arrival_time, total_seats, price } = req.body;
    if (!flight_number || !origin || !destination || !departure_time || !arrival_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const id = await createFlight({
      flight_number,
      origin,
      destination,
      departure_time,
      arrival_time,
      total_seats: total_seats || 150,
      price: price || 100,
    });
    res.status(201).json({ message: 'Flight created', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create flight' });
  }
}

export async function editFlight(req, res) {
  try {
    await updateFlight(req.query.id, req.body);
    res.status(200).json({ message: 'Flight updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update flight' });
  }
}

export async function removeFlight(req, res) {
  try {
    await deleteFlight(req.query.id);
    res.status(200).json({ message: 'Flight deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete flight' });
  }
}
