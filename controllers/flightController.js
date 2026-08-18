import {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
  assignAircraftAndGate,
  getFlightsWithAssignments,
} from '../models/flightModel';
import { getAircraftById, setAircraftStatus } from '../models/aircraftModel';
import { getGateById, setGateStatus } from '../models/gateModel';

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
    if (!req.query.id) {
      return res.status(400).json({ error: 'Missing flight id in the request URL' });
    }
    await updateFlight(req.query.id, req.body);
    res.status(200).json({ message: 'Flight updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update flight' });
  }
}

export async function removeFlight(req, res) {
  try {
    if (!req.query.id) {
      return res.status(400).json({ error: 'Missing flight id in the request URL' });
    }
    await deleteFlight(req.query.id);
    res.status(200).json({ message: 'Flight deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete flight' });
  }
}

// --- Sprint 2: Aircraft Assignment System + Gate Allocation Management (Member 1) ---

export async function assignFlight(req, res) {
  try {
    const { flight_id, aircraft_id, gate_id } = req.body;
    if (!flight_id) {
      return res.status(400).json({ error: 'flight_id is required' });
    }

    if (aircraft_id) {
      const aircraft = await getAircraftById(aircraft_id);
      if (!aircraft) return res.status(404).json({ error: 'Aircraft not found' });
      if (aircraft.status !== 'Available') {
        return res.status(400).json({ error: `${aircraft.tail_number} is not available (${aircraft.status})` });
      }
    }
    if (gate_id) {
      const gate = await getGateById(gate_id);
      if (!gate) return res.status(404).json({ error: 'Gate not found' });
      if (gate.status !== 'Available') {
        return res.status(400).json({ error: `Gate ${gate.gate_number} is not available (${gate.status})` });
      }
    }

    await assignAircraftAndGate(flight_id, { aircraft_id, gate_id });
    if (aircraft_id) await setAircraftStatus(aircraft_id, 'Assigned');
    if (gate_id) await setGateStatus(gate_id, 'Occupied');

    res.status(200).json({ message: 'Assignment saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save assignment' });
  }
}

export async function listAssignments(req, res) {
  try {
    const flights = await getFlightsWithAssignments();
    res.status(200).json(flights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
}
