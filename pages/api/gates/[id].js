import { removeGate } from '../../../controllers/gateController';
export default async function handler(req, res) {
  if (req.method === 'DELETE') return removeGate(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
