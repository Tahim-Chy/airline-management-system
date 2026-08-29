import { scheduleMaintenance, getAllMaintenance, getMaintenanceRecordById, completeMaintenance } from '../models/maintenanceModel';
import { setAircraftStatus } from '../models/aircraftModel';
import { requireRole } from '../lib/auth';

export async function schedule(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try {
    const { aircraft_id, maintenance_type, scheduled_date, notes } = req.body;
    if (!aircraft_id || !maintenance_type || !scheduled_date) return res.status(400).json({ error: 'Aircraft, type, and scheduled date are required' });
    const id = await scheduleMaintenance({ aircraft_id, maintenance_type, scheduled_date, notes });
    await setAircraftStatus(aircraft_id, 'In Maintenance');
    res.status(201).json({ message: 'Maintenance scheduled — aircraft marked In Maintenance', id });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to schedule maintenance' }); }
}
export async function list(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try { res.status(200).json(await getAllMaintenance()); } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch maintenance records' }); }
}
export async function complete(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try {
    const record = await getMaintenanceRecordById(req.query.id);
    if (!record) return res.status(404).json({ error: 'Maintenance record not found' });
    await completeMaintenance(req.query.id);
    await setAircraftStatus(record.aircraft_id, 'Available');
    res.status(200).json({ message: 'Maintenance completed — aircraft is Available again' });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to complete maintenance' }); }
}
