import { track, updateStatus } from '../../../controllers/baggageController';

export default async function handler(req, res) {
  if (req.method === 'GET') return track(req, res);
  if (req.method === 'PUT') return updateStatus(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
