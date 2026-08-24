import pool from '../lib/db';

export async function createReport({ baggage_tag, passenger_name, contact_email, description, last_seen_location }) {
  const [result] = await pool.query(
    `INSERT INTO lost_baggage_reports
      (baggage_tag, passenger_name, contact_email, description, last_seen_location, report_status)
     VALUES (?, ?, ?, ?, ?, 'Reported')`,
    [baggage_tag || null, passenger_name, contact_email, description, last_seen_location]
  );

  // If the tag matches a real bag already in the system, flip its status to Lost too,
  // so baggage tracking and the lost & found desk agree with each other.
  if (baggage_tag) {
    await pool.query('UPDATE baggage SET status = ? WHERE baggage_tag = ?', ['Lost', baggage_tag]);
  }

  return result.insertId;
}

export async function getAllReports() {
  const [rows] = await pool.query('SELECT * FROM lost_baggage_reports ORDER BY created_at DESC');
  return rows;
}

export async function getReportById(id) {
  const [rows] = await pool.query('SELECT * FROM lost_baggage_reports WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function updateReportStatus(id, report_status) {
  await pool.query(
    'UPDATE lost_baggage_reports SET report_status = ?, updated_at = NOW() WHERE id = ?',
    [report_status, id]
  );
}
