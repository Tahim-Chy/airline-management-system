import pool from '../lib/db';
export async function createFaultReport({ aircraft_id, reported_by, fault_description, severity }) {
  const [result] = await pool.query("INSERT INTO fault_reports (aircraft_id, reported_by, fault_description, severity, status, reported_at) VALUES (?, ?, ?, ?, 'Reported', NOW())", [aircraft_id, reported_by || null, fault_description, severity]);
  return result.insertId;
}
export async function getAllFaults() { const [rows] = await pool.query(`SELECT fr.*, a.tail_number, a.model, u.name AS reported_by_name FROM fault_reports fr JOIN aircraft a ON fr.aircraft_id = a.id LEFT JOIN users u ON fr.reported_by = u.id ORDER BY fr.reported_at DESC`); return rows; }
export async function getFaultById(id) { const [rows] = await pool.query('SELECT * FROM fault_reports WHERE id = ?', [id]); return rows[0] || null; }
export async function updateFaultStatus(id, status) {
  const resolvedDate = status === 'Resolved' ? 'NOW()' : 'NULL';
  await pool.query(`UPDATE fault_reports SET status = ?, resolved_at = ${resolvedDate} WHERE id = ?`, [status, id]);
}
export async function getOpenFaultCount() { const [rows] = await pool.query("SELECT COUNT(*) AS count FROM fault_reports WHERE status != 'Resolved'"); return rows[0].count; }
