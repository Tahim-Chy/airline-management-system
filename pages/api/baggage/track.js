import { trackBaggage } from '../../../controllers/baggageController';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return trackBaggage(req, res);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
