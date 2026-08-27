import { lookupBooking } from '../../../controllers/bookingController';

export default async function handler(req, res) {
  if (req.method === 'GET') return lookupBooking(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
