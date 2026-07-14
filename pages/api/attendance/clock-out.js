import { handleClockOut } from '../../../controllers/attendanceController';

export default async function handler(req, res) {
  if (req.method === 'POST') return handleClockOut(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
