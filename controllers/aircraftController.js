import { getAllAircraft, createAircraft, deleteAircraft } from '../models/aircraftModel';
import { requireRole } from '../lib/auth';

// Public GET — crew need this list to report faults, admin needs it to manage the fleet.
export async function listAircraft(req, res) {
  try { res.status(200).json(await getAllAircraft()); } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch aircraft' }); }
}
export async function addAircraft(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try {
    const { tail_number, model, capacity } = req.body;
    if (!tail_number || !model || !capacity) return res.status(400).json({ error: 'Tail number, model, and capacity are required' });
    const id = await createAircraft({ tail_number, model, capacity });
    res.status(201).json({ message: 'Aircraft added', id });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to add aircraft' }); }
}
export async function removeAircraft(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try { await deleteAircraft(req.query.id); res.status(200).json({ message: 'Aircraft removed' }); }
  catch (error) { console.error(error); res.status(500).json({ error: 'Failed to remove aircraft' }); }
}
