import { lookupAccount } from '../../../controllers/loyaltyController';
export default async function handler(req, res) {
  if (req.method === 'GET') return lookupAccount(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
