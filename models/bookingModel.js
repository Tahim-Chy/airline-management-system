import pool from '../lib/db';

export async function searchFlights({ origin, destination, date }) {
  let query = 'SELECT * FROM flights WHERE available_seats > 0';
  const params = [];

  if (origin) {
    query += ' AND origin LIKE ?';
    params.push(`%${origin}%`);
  }
  if (destination) {
    query += ' AND destination LIKE ?';
    params.push(`%${destination}%`);
  }
  if (date) {
    query += ' AND DATE(departure_time) = ?';
    params.push(date);
  }
  query += ' ORDER BY departure_time';

  const [rows] = await pool.query(query, params);
  return rows;
}

export async function createBooking(data) {
  const {
    flight_id,
    passenger_name,
    passenger_email,
    passenger_phone,
    passport_number,
    seat_count,
    total_price,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO bookings
      (flight_id, passenger_name, passenger_email, passenger_phone, passport_number, seat_count, total_price, booking_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'Confirmed')`,
    [flight_id, passenger_name, passenger_email, passenger_phone, passport_number, seat_count, total_price]
  );
  return result.insertId;
}

export async function getBookingById(id) {
  const [rows] = await pool.query(
    `SELECT b.*, f.flight_number, f.origin, f.destination, f.departure_time
     FROM bookings b
     JOIN flights f ON b.flight_id = f.id
     WHERE b.id = ?`,
    [id]
  );
  return rows[0] || null;
}
