import { unassign } from '../../../controllers/crewAssignmentController';

export default async function handler(req, res) {
  if (req.method === 'DELETE') return unassign(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
