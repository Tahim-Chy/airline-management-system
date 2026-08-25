import pool from '../lib/db';

export async function getAllFlights() {
  const [rows] = await pool.query('SELECT * FROM flights ORDER BY departure_time');
  return rows;
}

export async function getFlightById(id) {
  const [rows] = await pool.query('SELECT * FROM flights WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function createFlight(data) {
  const { flight_number, origin, destination, departure_time, arrival_time, total_seats, price } = data;
  const [result] = await pool.query(
    `INSERT INTO flights
      (flight_number, origin, destination, departure_time, arrival_time, total_seats, available_seats, price, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Scheduled')`,
    [flight_number, origin, destination, departure_time, arrival_time, total_seats, total_seats, price]
  );
  return result.insertId;
}

export async function updateFlight(id, data) {
  const { flight_number, origin, destination, departure_time, arrival_time, total_seats, price, status } = data;
  await pool.query(
    `UPDATE flights SET
      flight_number = ?, origin = ?, destination = ?, departure_time = ?,
      arrival_time = ?, total_seats = ?, price = ?, status = ?
     WHERE id = ?`,
    [flight_number, origin, destination, departure_time, arrival_time, total_seats, price, status, id]
  );
}

// Sprint 4: raw DELETE — errors (like FK constraints from existing bookings)
// are caught and translated into a friendly message by the controller.
export async function deleteFlight(id) {
  await pool.query('DELETE FROM flights WHERE id = ?', [id]);
}

export async function decrementAvailableSeats(flightId, count) {
  await pool.query('UPDATE flights SET available_seats = available_seats - ? WHERE id = ?', [count, flightId]);
}

export async function assignAircraftAndGate(flightId, { aircraft_id, gate_id }) {
  await pool.query('UPDATE flights SET aircraft_id = ?, gate_id = ? WHERE id = ?', [aircraft_id || null, gate_id || null, flightId]);
}

export async function getFlightsWithAssignments() {
  const [rows] = await pool.query(
    `SELECT
       f.id, f.flight_number, f.origin, f.destination, f.departure_time, f.status,
       a.id AS aircraft_id, a.tail_number, a.model,
       g.id AS gate_id, g.gate_number, g.terminal
     FROM flights f
     LEFT JOIN aircraft a ON f.aircraft_id = a.id
     LEFT JOIN gates g ON f.gate_id = g.id
     ORDER BY f.departure_time`
  );
  return rows;
}

export async function updateFlightStatus(id, status) {
  await pool.query('UPDATE flights SET status = ? WHERE id = ?', [status, id]);
}
