import { claimPoints } from '../../../controllers/loyaltyController';
export default async function handler(req, res) {
  if (req.method === 'POST') return claimPoints(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
