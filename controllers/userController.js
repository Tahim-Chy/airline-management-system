import { getAllCrew } from '../models/userModel';

export async function listCrew(req, res) {
  try {
    const crew = await getAllCrew();
    res.status(200).json(crew);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch crew list' });
  }
}
