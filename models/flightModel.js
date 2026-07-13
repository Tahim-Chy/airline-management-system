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

export async function deleteFlight(id) {
  await pool.query('DELETE FROM flights WHERE id = ?', [id]);
}

export async function decrementAvailableSeats(flightId, count) {
  await pool.query(
    'UPDATE flights SET available_seats = available_seats - ? WHERE id = ?',
    [count, flightId]
  );
}
