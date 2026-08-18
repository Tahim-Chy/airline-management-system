import { getAllAircraft, createAircraft, deleteAircraft } from '../models/aircraftModel';

export async function listAircraft(req, res) {
  try {
    const aircraft = await getAllAircraft();
    res.status(200).json(aircraft);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch aircraft' });
  }
}

export async function addAircraft(req, res) {
  try {
    const { tail_number, model, capacity } = req.body;
    if (!tail_number || !model || !capacity) {
      return res.status(400).json({ error: 'Tail number, model, and capacity are required' });
    }
    const id = await createAircraft({ tail_number, model, capacity });
    res.status(201).json({ message: 'Aircraft added', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add aircraft' });
  }
}

export async function removeAircraft(req, res) {
  try {
    await deleteAircraft(req.query.id);
    res.status(200).json({ message: 'Aircraft removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove aircraft' });
  }
}
