import { changeStatus } from '../../../../controllers/flightController';
export default async function handler(req, res) {
  if (req.method === 'PATCH') return changeStatus(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
