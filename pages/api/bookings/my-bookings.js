import { myBookings } from '../../../controllers/bookingController';
export default async function handler(req, res) {
  if (req.method === 'GET') return myBookings(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
