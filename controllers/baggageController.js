import { registerBaggage, getBaggageByTag, updateBaggageStatus, getAllBaggage, getBaggageCountForBooking, calculateExtraFee } from '../models/baggageModel';
import { getBookingById } from '../models/bookingModel';
import { requireRole } from '../lib/auth';

// Public — a passenger registers their own bag against their own booking.
export async function register(req, res) {
  try {
    const { booking_id, weight_kg } = req.body;
    if (!booking_id || !weight_kg) return res.status(400).json({ error: 'Booking ID and weight are required' });
    const booking = await getBookingById(booking_id);
    if (!booking) return res.status(404).json({ error: 'Booking not found — check the Booking ID' });
    const existingCount = await getBaggageCountForBooking(booking_id);
    const bagNumber = existingCount + 1;
    const extra_fee = calculateExtraFee(Number(weight_kg), bagNumber);
    const baggage = await registerBaggage({ booking_id, weight_kg, extra_fee });
    res.status(201).json({ message: 'Baggage registered', bag_number: bagNumber, extra_fee, ...baggage });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to register baggage' }); }
}

// Admin/ground staff only — the full baggage list is operational data.
export async function list(req, res) {
  if (!requireRole(req, res, ['admin', 'ground_staff'])) return;
  try { res.status(200).json(await getAllBaggage()); } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch baggage' }); }
}

// Public — a passenger tracking their own bag by tag (the tag is the "secret").
export async function track(req, res) {
  try {
    const baggage = await getBaggageByTag(req.query.tag);
    if (!baggage) return res.status(404).json({ error: 'No baggage found with that tag' });
    res.status(200).json(baggage);
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to track baggage' }); }
}

// Admin/ground staff only — changing baggage status is a handling decision,
// not something the passenger tracking their own bag should be able to do.
export async function updateStatus(req, res) {
  if (!requireRole(req, res, ['admin', 'ground_staff'])) return;
  try { await updateBaggageStatus(req.query.tag, req.body.status); res.status(200).json({ message: 'Status updated' }); }
  catch (error) { console.error(error); res.status(500).json({ error: 'Failed to update status' }); }
}
