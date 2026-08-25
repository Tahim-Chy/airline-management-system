import { add, listAll } from '../../../controllers/certificationController';
export default async function handler(req, res) {
  if (req.method === 'POST') return add(req, res);
  if (req.method === 'GET') return listAll(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
