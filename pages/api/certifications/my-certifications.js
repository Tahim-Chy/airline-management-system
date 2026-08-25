import { myGetCertifications } from '../../../controllers/certificationController';
export default async function handler(req, res) {
  if (req.method === 'GET') return myGetCertifications(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
