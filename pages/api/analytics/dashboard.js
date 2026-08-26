import { getDashboardData } from '../../../controllers/analyticsController';
export default async function handler(req, res) {
  if (req.method === 'GET') return getDashboardData(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
