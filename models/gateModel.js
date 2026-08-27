import pool from '../lib/db';
export async function getAllGates() { const [rows] = await pool.query('SELECT * FROM gates ORDER BY gate_number'); return rows; }
export async function getGateById(id) { const [rows] = await pool.query('SELECT * FROM gates WHERE id = ?', [id]); return rows[0] || null; }
export async function createGate({ gate_number, terminal }) {
  const [result] = await pool.query("INSERT INTO gates (gate_number, terminal, status) VALUES (?, ?, 'Available')", [gate_number, terminal]);
  return result.insertId;
}
export async function setGateStatus(id, status) { await pool.query('UPDATE gates SET status = ? WHERE id = ?', [status, id]); }
export async function deleteGate(id) { await pool.query('DELETE FROM gates WHERE id = ?', [id]); }
