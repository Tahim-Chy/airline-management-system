import { getQueue } from '../../../controllers/boardingController';
export default async function handler(req, res) {
  if (req.method === 'GET') return getQueue(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
