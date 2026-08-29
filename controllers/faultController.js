import { createFaultReport, getAllFaults, getFaultById, updateFaultStatus } from '../models/faultModel';
import { setAircraftStatus, getAircraftById } from '../models/aircraftModel';
import { requireRole } from '../lib/auth';

const SEVERITIES = ['Minor', 'Major', 'Critical'];
const STATUSES = ['Reported', 'Under Repair', 'Resolved'];

// Crew (or admin) only — reporting a fault is a flight-operations duty.
export async function report(req, res) {
  const user = requireRole(req, res, ['admin', 'crew']);
  if (!user) return;
  try {
    const { aircraft_id, fault_description, severity } = req.body;
    if (!aircraft_id || !fault_description || !severity) return res.status(400).json({ error: 'Aircraft, description, and severity are required' });
    if (!SEVERITIES.includes(severity)) return res.status(400).json({ error: `Severity must be one of: ${SEVERITIES.join(', ')}` });
    const aircraft = await getAircraftById(aircraft_id);
    if (!aircraft) return res.status(404).json({ error: 'Aircraft not found' });
    const id = await createFaultReport({ aircraft_id, reported_by: user.id, fault_description, severity });
    if (severity === 'Major' || severity === 'Critical') await setAircraftStatus(aircraft_id, 'In Maintenance');
    res.status(201).json({ message: severity === 'Minor' ? 'Fault reported' : 'Fault reported — aircraft grounded for repair', id });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to report fault' }); }
}
export async function list(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try { res.status(200).json(await getAllFaults()); } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch fault reports' }); }
}
export async function updateStatus(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) return res.status(400).json({ error: `Status must be one of: ${STATUSES.join(', ')}` });
    const fault = await getFaultById(req.query.id);
    if (!fault) return res.status(404).json({ error: 'Fault report not found' });
    await updateFaultStatus(req.query.id, status);
    if (status === 'Resolved') await setAircraftStatus(fault.aircraft_id, 'Available');
    res.status(200).json({ message: 'Status updated' });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to update status' }); }
}
