import { createReport, getAllReports, updateReportStatus } from '../models/lostBaggageModel';
import { requireRole } from '../lib/auth';

const VALID_STATUSES = ['Reported', 'Investigating', 'Found', 'Returned', 'Closed'];

export async function report(req, res) {
  try {
    const { baggage_tag, passenger_name, contact_email, description, last_seen_location } = req.body;
    if (!passenger_name || !contact_email || !description) return res.status(400).json({ error: 'Name, email, and description are required' });
    const id = await createReport({ baggage_tag, passenger_name, contact_email, description, last_seen_location });
    res.status(201).json({ message: 'Lost baggage report submitted', id });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to submit report' }); }
}
export async function list(req, res) {
  if (!requireRole(req, res, ['admin', 'ground_staff'])) return;
  try { res.status(200).json(await getAllReports()); } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch reports' }); }
}
export async function updateStatus(req, res) {
  if (!requireRole(req, res, ['admin', 'ground_staff'])) return;
  try {
    const { report_status } = req.body;
    if (!VALID_STATUSES.includes(report_status)) return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
    await updateReportStatus(req.query.id, report_status);
    res.status(200).json({ message: 'Status updated' });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to update status' }); }
}
