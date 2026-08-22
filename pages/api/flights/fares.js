import { listFares } from '../../../controllers/flightController';
export default async function handler(req, res) {
  if (req.method === 'GET') return listFares(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
