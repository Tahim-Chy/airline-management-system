import { getSeatMap, saveSeats } from '../../../../controllers/seatController';

export default async function handler(req, res) {
  if (req.method === 'GET') return getSeatMap(req, res);
  if (req.method === 'PUT') return saveSeats(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
