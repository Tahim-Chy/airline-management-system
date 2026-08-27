import { getDashboardStats } from '../../../controllers/dashboardController';
export default async function handler(req, res) {
  if (req.method === 'GET') return getDashboardStats(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
