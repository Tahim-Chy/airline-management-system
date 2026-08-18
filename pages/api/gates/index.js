import { listGates, addGate } from '../../../controllers/gateController';

export default async function handler(req, res) {
  if (req.method === 'GET') return listGates(req, res);
  if (req.method === 'POST') return addGate(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
