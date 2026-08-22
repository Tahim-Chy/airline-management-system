import { assign, listAll } from '../../../controllers/crewAssignmentController';

export default async function handler(req, res) {
  if (req.method === 'GET') return listAll(req, res);
  if (req.method === 'POST') return assign(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
