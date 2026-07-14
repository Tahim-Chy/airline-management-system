import { register, list } from '../../../controllers/baggageController';

export default async function handler(req, res) {
  if (req.method === 'POST') return register(req, res);
  if (req.method === 'GET') return list(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
