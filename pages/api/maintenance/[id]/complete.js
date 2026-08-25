import { complete } from '../../../../controllers/maintenanceController';
export default async function handler(req, res) {
  if (req.method === 'PATCH') return complete(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
