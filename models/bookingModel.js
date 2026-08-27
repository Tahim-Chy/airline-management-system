import pool from '../lib/db';

const BOOKABLE_STATUSES = ['Scheduled', 'Boarding', 'Delayed'];

export async function searchFlights({ origin, destination, date }) {
  let query = `SELECT * FROM flights WHERE available_seats > 0 AND status IN (?)`;
  const params = [BOOKABLE_STATUSES];

  if (origin) { query += ' AND origin LIKE ?'; params.push(`%${origin}%`); }
  if (destination) { query += ' AND destination LIKE ?'; params.push(`%${destination}%`); }
  if (date) { query += ' AND DATE(departure_time) = ?'; params.push(date); }
  query += ' ORDER BY departure_time';

  const [rows] = await pool.query(query, params);
  return rows;
}

// Sprint "final polish": bookings now optionally link to a logged-in user's
// account (user_id is nullable — guest bookings without an account still
// work exactly as before).
export async function createBooking(data) {
  const { flight_id, user_id, passenger_name, passenger_email, passenger_phone, passport_number, seat_count, total_price } = data;
  const [result] = await pool.query(
    `INSERT INTO bookings
      (flight_id, user_id, passenger_name, passenger_email, passenger_phone, passport_number, seat_count, total_price, booking_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed')`,
    [flight_id, user_id || null, passenger_name, passenger_email, passenger_phone, passport_number, seat_count, total_price]
  );
  return result.insertId;
}

export async function getBookingById(id) {
  const [rows] = await pool.query(
    `SELECT b.*, f.flight_number, f.origin, f.destination, f.departure_time, f.arrival_time, f.total_seats, f.status AS flight_status
     FROM bookings b JOIN flights f ON b.flight_id = f.id WHERE b.id = ?`,
    [id]
  );
  return rows[0] || null;
}

// New: a logged-in passenger's full booking history.
export async function getBookingsForUser(userId) {
  const [rows] = await pool.query(
    `SELECT b.*, f.flight_number, f.origin, f.destination, f.departure_time, f.status AS flight_status
     FROM bookings b JOIN flights f ON b.flight_id = f.id
     WHERE b.user_id = ?
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return rows;
}

export async function getTakenSeats(flightId, excludingBookingId) {
  const [rows] = await pool.query(
    `SELECT seat_numbers FROM bookings WHERE flight_id = ? AND seat_numbers IS NOT NULL AND id != ?`,
    [flightId, excludingBookingId || 0]
  );
  return rows.flatMap((row) => (row.seat_numbers ? row.seat_numbers.split(',') : [])).map((s) => s.trim());
}

export async function saveSeatsAndMeal(bookingId, { seat_numbers, meal_preference }) {
  await pool.query('UPDATE bookings SET seat_numbers = ?, meal_preference = ? WHERE id = ?', [seat_numbers, meal_preference, bookingId]);
}

export async function getTodayBookingCount() {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM bookings WHERE DATE(created_at) = CURDATE() AND booking_status = 'Confirmed'");
  return rows[0].count;
}
