import { registerBaggage } from '../../../controllers/baggageController';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return registerBaggage(req, res);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
