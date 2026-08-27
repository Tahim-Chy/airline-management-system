import { removeAircraft } from '../../../controllers/aircraftController';
export default async function handler(req, res) {
  if (req.method === 'DELETE') return removeAircraft(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
