import { getBoardingPass } from '../../../controllers/boardingPassController';
export default async function handler(req, res) {
  if (req.method === 'GET') return getBoardingPass(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
