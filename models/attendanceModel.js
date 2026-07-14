import pool from '../lib/db';

export async function clockIn(crewId) {
  const today = new Date().toISOString().slice(0, 10);
  const [result] = await pool.query(
    'INSERT INTO attendance (crew_id, clock_in, attendance_date) VALUES (?, NOW(), ?)',
    [crewId, today]
  );
  return result.insertId;
}

export async function clockOut(attendanceId) {
  const [rows] = await pool.query('SELECT clock_in FROM attendance WHERE id = ?', [attendanceId]);
  if (!rows[0]) return null;

  const clockInTime = new Date(rows[0].clock_in);
  const clockOutTime = new Date();
  const workingHours = ((clockOutTime - clockInTime) / (1000 * 60 * 60)).toFixed(2);

  await pool.query('UPDATE attendance SET clock_out = NOW(), working_hours = ? WHERE id = ?', [
    workingHours,
    attendanceId,
  ]);
  return workingHours;
}

export async function getOpenAttendance(crewId) {
  const [rows] = await pool.query(
    'SELECT * FROM attendance WHERE crew_id = ? AND clock_out IS NULL ORDER BY clock_in DESC LIMIT 1',
    [crewId]
  );
  return rows[0] || null;
}

export async function getAttendanceHistory(crewId) {
  const [rows] = await pool.query(
    'SELECT * FROM attendance WHERE crew_id = ? ORDER BY attendance_date DESC',
    [crewId]
  );
  return rows;
}
