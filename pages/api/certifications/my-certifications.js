import { myCertifications } from '../../../controllers/certificationController';
export default async function handler(req, res) {
  if (req.method === 'GET') return myCertifications(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
