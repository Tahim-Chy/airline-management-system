import pool from '../lib/db';

export async function assignCrewToFlight({ flight_id, crew_id, role_on_flight }) {
  const [result] = await pool.query(
    'INSERT INTO crew_assignments (flight_id, crew_id, role_on_flight) VALUES (?, ?, ?)',
    [flight_id, crew_id, role_on_flight]
  );
  return result.insertId;
}

export async function getAllAssignments() {
  const [rows] = await pool.query(
    `SELECT ca.id, ca.role_on_flight, ca.created_at,
            f.id AS flight_id, f.flight_number, f.origin, f.destination, f.departure_time,
            u.id AS crew_id, u.name AS crew_name
     FROM crew_assignments ca
     JOIN flights f ON ca.flight_id = f.id
     JOIN users u ON ca.crew_id = u.id
     ORDER BY f.departure_time`
  );
  return rows;
}

export async function getScheduleForCrew(crewId) {
  const [rows] = await pool.query(
    `SELECT ca.id, ca.role_on_flight,
            f.flight_number, f.origin, f.destination, f.departure_time, f.status
     FROM crew_assignments ca
     JOIN flights f ON ca.flight_id = f.id
     WHERE ca.crew_id = ?
     ORDER BY f.departure_time`,
    [crewId]
  );
  return rows;
}

export async function removeAssignment(id) {
  await pool.query('DELETE FROM crew_assignments WHERE id = ?', [id]);
}

export async function isCrewAlreadyOnFlight(flightId, crewId) {
  const [rows] = await pool.query(
    'SELECT id FROM crew_assignments WHERE flight_id = ? AND crew_id = ?',
    [flightId, crewId]
  );
  return rows.length > 0;
}
