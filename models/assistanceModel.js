import pool from '../lib/db';
export async function createRequest({ booking_id, request_type, notes }) {
  const [result] = await pool.query("INSERT INTO assistance_requests (booking_id, request_type, notes, status) VALUES (?, ?, ?, 'Pending')", [booking_id, request_type, notes || null]);
  return result.insertId;
}
export async function getAllRequests() {
  const [rows] = await pool.query(`SELECT ar.*, b.passenger_name, b.flight_id, f.flight_number FROM assistance_requests ar JOIN bookings b ON ar.booking_id = b.id JOIN flights f ON b.flight_id = f.id ORDER BY ar.created_at DESC`);
  return rows;
}
export async function updateRequestStatus(id, status) { await pool.query('UPDATE assistance_requests SET status = ? WHERE id = ?', [status, id]); }
