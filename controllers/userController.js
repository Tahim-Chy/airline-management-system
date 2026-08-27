import { getAllCrew } from '../models/userModel';
export async function listCrew(req, res) { try { res.status(200).json(await getAllCrew()); } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch crew list' }); } }
