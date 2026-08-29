import { getAllCrew } from '../models/userModel';
import { requireRole } from '../lib/auth';

export async function listCrew(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try { res.status(200).json(await getAllCrew()); } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch crew list' }); }
}
