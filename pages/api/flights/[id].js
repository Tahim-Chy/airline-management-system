import { getFlight, editFlight, removeFlight } from '../../../controllers/flightController';

export default async function handler(req, res) {
  if (req.method === 'GET') return getFlight(req, res);
  if (req.method === 'PUT') return editFlight(req, res);
  if (req.method === 'DELETE') return removeFlight(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
