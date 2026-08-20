import { toggleBoarded } from '../../../controllers/boardingController';

export default async function handler(req, res) {
  if (req.method === 'PUT') return toggleBoarded(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
