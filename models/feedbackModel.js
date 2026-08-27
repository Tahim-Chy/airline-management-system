import pool from '../lib/db';
export async function createFeedback({ name, email, booking_id, category, message }) {
  const [result] = await pool.query("INSERT INTO feedback (name, email, booking_id, category, message, status) VALUES (?, ?, ?, ?, ?, 'New')", [name, email, booking_id || null, category, message]);
  return result.insertId;
}
export async function getAllFeedback() { const [rows] = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC'); return rows; }
export async function updateFeedbackStatus(id, status) { await pool.query('UPDATE feedback SET status = ? WHERE id = ?', [status, id]); }
