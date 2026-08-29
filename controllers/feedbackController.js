import { createFeedback, getAllFeedback, updateFeedbackStatus } from '../models/feedbackModel';
import { requireRole } from '../lib/auth';

const CATEGORIES = ['Complaint', 'Compliment', 'Suggestion'];
const STATUSES = ['New', 'In Review', 'Resolved'];

export async function submit(req, res) {
  try {
    const { name, email, booking_id, category, message } = req.body;
    if (!name || !email || !category || !message) return res.status(400).json({ error: 'Name, email, category, and message are required' });
    if (!CATEGORIES.includes(category)) return res.status(400).json({ error: `Category must be one of: ${CATEGORIES.join(', ')}` });
    const id = await createFeedback({ name, email, booking_id, category, message });
    res.status(201).json({ message: 'Thank you for your feedback', id });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to submit feedback' }); }
}
export async function list(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try { res.status(200).json(await getAllFeedback()); } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch feedback' }); }
}
export async function updateStatus(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) return res.status(400).json({ error: `Status must be one of: ${STATUSES.join(', ')}` });
    await updateFeedbackStatus(req.query.id, status);
    res.status(200).json({ message: 'Status updated' });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to update status' }); }
}
