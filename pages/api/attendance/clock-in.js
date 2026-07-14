import { handleClockIn } from '../../../controllers/attendanceController';

export default async function handler(req, res) {
  if (req.method === 'POST') return handleClockIn(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
