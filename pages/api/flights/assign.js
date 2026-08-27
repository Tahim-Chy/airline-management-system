import { assignFlight } from '../../../controllers/flightController';
export default async function handler(req, res) {
  if (req.method === 'POST') return assignFlight(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
