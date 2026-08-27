import { resetPassword } from '../../../controllers/authController';

export default async function handler(req, res) {
  if (req.method === 'POST') return resetPassword(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
