import {
  registerBaggage,
  getBaggageByTag,
  updateBaggageStatus,
  getAllBaggage,
} from '../models/baggageModel';
import { getBookingById } from '../models/bookingModel';

export async function register(req, res) {
  try {
    const { booking_id, weight_kg } = req.body;
    if (!booking_id || !weight_kg) {
      return res.status(400).json({ error: 'Booking ID and weight are required' });
    }

    const booking = await getBookingById(booking_id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found — check the Booking ID' });
    }

    const baggage = await registerBaggage({ booking_id, weight_kg });
    res.status(201).json({ message: 'Baggage registered', ...baggage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register baggage' });
  }
}

export async function list(req, res) {
  try {
    const baggage = await getAllBaggage();
    res.status(200).json(baggage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch baggage' });
  }
}

export async function track(req, res) {
  try {
    const baggage = await getBaggageByTag(req.query.tag);
    if (!baggage) return res.status(404).json({ error: 'No baggage found with that tag' });
    res.status(200).json(baggage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to track baggage' });
  }
}

export async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    await updateBaggageStatus(req.query.tag, status);
    res.status(200).json({ message: 'Status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update status' });
  }
}
