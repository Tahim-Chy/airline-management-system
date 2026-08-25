import { scheduleMaintenance, getAllMaintenance, getMaintenanceRecord, completeMaintenance } from '../models/maintenanceModel';
import { setAircraftStatus } from '../models/aircraftModel';

export async function schedule(req, res) {
  try {
    const { aircraft_id, maintenance_type, scheduled_date, notes } = req.body;
    if (!aircraft_id || !maintenance_type || !scheduled_date) {
      return res.status(400).json({ error: 'Aircraft, maintenance type, and scheduled date are required' });
    }

    const id = await scheduleMaintenance({ aircraft_id, maintenance_type, scheduled_date, notes });
    // Mark the aircraft as In Maintenance so it drops out of the assignment dropdown (Member 1's feature).
    await setAircraftStatus(aircraft_id, 'In Maintenance');

    res.status(201).json({ message: 'Maintenance scheduled', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to schedule maintenance' });
  }
}

export async function list(req, res) {
  try {
    const records = await getAllMaintenance();
    res.status(200).json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch maintenance records' });
  }
}

export async function complete(req, res) {
  try {
    const record = await getMaintenanceRecord(req.query.id);
    if (!record) return res.status(404).json({ error: 'Maintenance record not found' });

    await completeMaintenance(req.query.id);
    // Aircraft is airworthy again — make it available for assignment.
    await setAircraftStatus(record.aircraft_id, 'Available');

    res.status(200).json({ message: 'Maintenance marked complete — aircraft is available again' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to complete maintenance' });
  }
}
