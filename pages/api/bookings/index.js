import { book } from '../../../controllers/bookingController';

export default async function handler(req, res) {
  if (req.method === 'POST') return book(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
