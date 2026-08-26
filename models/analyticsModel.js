import pool from '../lib/db';

export async function getTotalRevenue() {
  const [bookingRows] = await pool.query("SELECT COALESCE(SUM(total_price), 0) AS total FROM bookings WHERE booking_status = 'Confirmed'");
  const [baggageRows] = await pool.query('SELECT COALESCE(SUM(extra_fee), 0) AS total FROM baggage');
  return Number(bookingRows[0].total) + Number(baggageRows[0].total);
}

export async function getRevenueByMonth() {
  const [bookingRows] = await pool.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(total_price) AS total
     FROM bookings WHERE booking_status = 'Confirmed' GROUP BY month ORDER BY month`
  );
  return bookingRows;
}

export async function getRevenueByFlight() {
  const [rows] = await pool.query(
    `SELECT f.flight_number, f.origin, f.destination, COALESCE(SUM(b.total_price), 0) AS revenue, COUNT(b.id) AS bookings_count
     FROM flights f
     LEFT JOIN bookings b ON b.flight_id = f.id AND b.booking_status = 'Confirmed'
     GROUP BY f.id
     ORDER BY revenue DESC
     LIMIT 10`
  );
  return rows;
}

export async function getBookingCount() {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM bookings WHERE booking_status = 'Confirmed'");
  return rows[0].count;
}
