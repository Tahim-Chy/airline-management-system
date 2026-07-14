import { listUnassigned, assignBaggageId } from '../../../controllers/baggageController';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return listUnassigned(req, res);
  }
  if (req.method === 'POST') {
    return assignBaggageId(req, res);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
