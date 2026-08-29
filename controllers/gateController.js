import { getAllGates, createGate, deleteGate } from '../models/gateModel';
import { requireRole } from '../lib/auth';

export async function listGates(req, res) {
  try { res.status(200).json(await getAllGates()); } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch gates' }); }
}
export async function addGate(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try {
    const { gate_number, terminal } = req.body;
    if (!gate_number || !terminal) return res.status(400).json({ error: 'Gate number and terminal are required' });
    const id = await createGate({ gate_number, terminal });
    res.status(201).json({ message: 'Gate added', id });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to add gate' }); }
}
export async function removeGate(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try { await deleteGate(req.query.id); res.status(200).json({ message: 'Gate removed' }); }
  catch (error) { console.error(error); res.status(500).json({ error: 'Failed to remove gate' }); }
}
