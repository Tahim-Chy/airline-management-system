import { emailBoardingPass } from '../../../controllers/boardingPassController';
export default async function handler(req, res) {
  if (req.method === 'POST') return emailBoardingPass(req, res);
  res.status(405).json({ error: 'Method not allowed' });
}
