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
    `SELECT b.*, f.flight_number, f.origin, f.destination, f.departure_time, f.total_seats
     FROM bookings b
     JOIN flights f ON b.flight_id = f.id
     WHERE b.id = ?`,
    [id]
  );
  return rows[0] || null;
}

// --- Sprint 2: Seat Selection & Meal Preference System (Member 2) ---

// All seat labels already taken on this flight, across every OTHER booking.
export async function getTakenSeats(flightId, excludingBookingId) {
  const [rows] = await pool.query(
    `SELECT seat_numbers FROM bookings
     WHERE flight_id = ? AND seat_numbers IS NOT NULL AND id != ?`,
    [flightId, excludingBookingId || 0]
  );
  return rows
    .flatMap((row) => (row.seat_numbers ? row.seat_numbers.split(',') : []))
    .map((s) => s.trim());
}

export async function saveSeatsAndMeal(bookingId, { seat_numbers, meal_preference }) {
  await pool.query(
    'UPDATE bookings SET seat_numbers = ?, meal_preference = ? WHERE id = ?',
    [seat_numbers, meal_preference, bookingId]
  );
}

