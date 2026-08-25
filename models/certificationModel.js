import pool from '../lib/db';

// Pure function — easy to unit test and explain in a demo.
export function certStatus(expiryDate) {
  const daysLeft = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return 'Expired';
  if (daysLeft <= 30) return 'Expiring Soon';
  return 'Valid';
}

export async function addCertification({ crew_id, certification_name, issue_date, expiry_date }) {
  const [result] = await pool.query(
    'INSERT INTO crew_certifications (crew_id, certification_name, issue_date, expiry_date) VALUES (?, ?, ?, ?)',
    [crew_id, certification_name, issue_date, expiry_date]
  );
  return result.insertId;
}

export async function getAllCertifications() {
  const [rows] = await pool.query(
    `SELECT cc.*, u.name AS crew_name
     FROM crew_certifications cc
     JOIN users u ON cc.crew_id = u.id
     ORDER BY cc.expiry_date ASC`
  );
  return rows;
}

export async function getCertificationsForCrew(crewId) {
  const [rows] = await pool.query(
    'SELECT * FROM crew_certifications WHERE crew_id = ? ORDER BY expiry_date ASC',
    [crewId]
  );
  return rows;
}
