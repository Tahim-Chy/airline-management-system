import { listCrew } from '../../../controllers/userController';

export default async function handler(req, res) {
  if (req.method === 'GET') return listCrew(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
