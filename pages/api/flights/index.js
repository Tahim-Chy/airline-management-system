import { listFlights, addFlight } from '../../../controllers/flightController';

export default async function handler(req, res) {
  if (req.method === 'GET') return listFlights(req, res);
  if (req.method === 'POST') return addFlight(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
