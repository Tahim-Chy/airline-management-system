import { assignCrewToFlight, getAllAssignments, getScheduleForCrew, removeAssignment, isCrewAlreadyOnFlight } from '../models/crewAssignmentModel';
import { requireRole } from '../lib/auth';

export async function assign(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try {
    const { flight_id, crew_id, role_on_flight } = req.body;
    if (!flight_id || !crew_id || !role_on_flight) return res.status(400).json({ error: 'Flight, crew member, and role are all required' });
    if (await isCrewAlreadyOnFlight(flight_id, crew_id)) return res.status(409).json({ error: 'This crew member is already assigned to this flight' });
    const id = await assignCrewToFlight({ flight_id, crew_id, role_on_flight });
    res.status(201).json({ message: 'Crew assigned', id });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to assign crew' }); }
}
export async function listAll(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try { res.status(200).json(await getAllAssignments()); } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch crew assignments' }); }
}
export async function myGetSchedule(req, res) {
  const user = requireRole(req, res, ['admin', 'crew']);
  if (!user) return;
  try { res.status(200).json(await getScheduleForCrew(user.id)); } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch schedule' }); }
}
export async function unassign(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try { await removeAssignment(req.query.id); res.status(200).json({ message: 'Assignment removed' }); }
  catch (error) { console.error(error); res.status(500).json({ error: 'Failed to remove assignment' }); }
}
