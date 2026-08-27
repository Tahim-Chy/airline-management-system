import { listAircraft, addAircraft } from '../../../controllers/aircraftController';
export default async function handler(req, res) {
  if (req.method === 'GET') return listAircraft(req, res);
  if (req.method === 'POST') return addAircraft(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
