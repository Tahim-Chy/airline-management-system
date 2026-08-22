import { myGetSchedule } from '../../../controllers/crewAssignmentController';

export default async function handler(req, res) {
  if (req.method === 'GET') return myGetSchedule(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
