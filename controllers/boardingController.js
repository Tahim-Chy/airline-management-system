import { setBoardingGroup, setBoarded, getBoardingQueueForFlight, getBookingsWithoutBoardingGroup } from '../models/boardingModel';
import { requireRole } from '../lib/auth';

function groupForSeats(seatNumbers) {
  if (!seatNumbers) return 'General';
  const rows = seatNumbers.split(',').map((s) => parseInt(s, 10)).filter((n) => !Number.isNaN(n));
  if (rows.length === 0) return 'General';
  const lowestRow = Math.min(...rows);
  if (lowestRow <= 5) return '1'; if (lowestRow <= 15) return '2'; return '3';
}

export async function assignGroups(req, res) {
  if (!requireRole(req, res, ['admin', 'ground_staff'])) return;
  try {
    const { flight_id } = req.body;
    if (!flight_id) return res.status(400).json({ error: 'flight_id is required' });
    const pending = await getBookingsWithoutBoardingGroup(flight_id);
    for (const booking of pending) await setBoardingGroup(booking.id, groupForSeats(booking.seat_numbers));
    res.status(200).json({ message: `Assigned boarding groups for ${pending.length} passenger(s)` });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to assign boarding groups' }); }
}
export async function getQueue(req, res) {
  if (!requireRole(req, res, ['admin', 'ground_staff'])) return;
  try {
    const { flight_id } = req.query;
    if (!flight_id) return res.status(400).json({ error: 'flight_id is required' });
    res.status(200).json(await getBoardingQueueForFlight(flight_id));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch boarding queue' }); }
}
export async function toggleBoarded(req, res) {
  if (!requireRole(req, res, ['admin', 'ground_staff'])) return;
  try { await setBoarded(req.query.id, req.body.boarded); res.status(200).json({ message: req.body.boarded ? 'Marked as boarded' : 'Marked as not boarded' }); }
  catch (error) { console.error(error); res.status(500).json({ error: 'Failed to update boarding status' }); }
}
