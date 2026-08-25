import pool from '../lib/db';

export async function scheduleMaintenance({ aircraft_id, maintenance_type, scheduled_date, notes }) {
  const [result] = await pool.query(
    `INSERT INTO maintenance_records (aircraft_id, maintenance_type, scheduled_date, notes, status)
     VALUES (?, ?, ?, ?, 'Scheduled')`,
    [aircraft_id, maintenance_type, scheduled_date, notes || null]
  );
  return result.insertId;
}

export async function getAllMaintenance() {
  const [rows] = await pool.query(
    `SELECT mr.*, a.tail_number, a.model
     FROM maintenance_records mr
     JOIN aircraft a ON mr.aircraft_id = a.id
     ORDER BY mr.scheduled_date DESC`
  );
  return rows;
}

export async function getMaintenanceRecord(id) {
  const [rows] = await pool.query('SELECT * FROM maintenance_records WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function completeMaintenance(id) {
  await pool.query(
    "UPDATE maintenance_records SET status = 'Completed', completed_date = CURDATE() WHERE id = ?",
    [id]
  );
}
