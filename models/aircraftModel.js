import pool from '../lib/db';

export async function getAllAircraft() {
  const [rows] = await pool.query('SELECT * FROM aircraft ORDER BY tail_number');
  return rows;
}

export async function getAircraftById(id) {
  const [rows] = await pool.query('SELECT * FROM aircraft WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function createAircraft({ tail_number, model, capacity }) {
  const [result] = await pool.query(
    "INSERT INTO aircraft (tail_number, model, capacity, status) VALUES (?, ?, ?, 'Available')",
    [tail_number, model, capacity]
  );
  return result.insertId;
}

export async function setAircraftStatus(id, status) {
  await pool.query('UPDATE aircraft SET status = ? WHERE id = ?', [status, id]);
}

export async function deleteAircraft(id) {
  await pool.query('DELETE FROM aircraft WHERE id = ?', [id]);
}
