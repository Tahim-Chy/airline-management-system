import pool from '../lib/db';
export async function addCertification({ crew_id, certification_name, issue_date, expiry_date }) {
  const [result] = await pool.query('INSERT INTO crew_certifications (crew_id, certification_name, issue_date, expiry_date) VALUES (?, ?, ?, ?)', [crew_id, certification_name, issue_date, expiry_date]);
  return result.insertId;
}
export async function getAllCertifications() { const [rows] = await pool.query(`SELECT cc.*, u.name AS crew_name FROM crew_certifications cc JOIN users u ON cc.crew_id = u.id ORDER BY cc.expiry_date`); return rows; }
export async function getCertificationsForCrew(crewId) { const [rows] = await pool.query('SELECT * FROM crew_certifications WHERE crew_id = ? ORDER BY expiry_date', [crewId]); return rows; }
export async function getExpiringSoonCount() {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM crew_certifications WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)");
  return rows[0].count;
}
