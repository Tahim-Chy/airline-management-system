import { listAssignments } from '../../../controllers/flightController';
export default async function handler(req, res) {
  if (req.method === 'GET') return listAssignments(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
