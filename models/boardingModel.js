import pool from '../lib/db';
export async function setBoardingGroup(bookingId, group) { await pool.query('UPDATE bookings SET boarding_group = ? WHERE id = ?', [group, bookingId]); }
export async function setBoarded(bookingId, boarded) { await pool.query('UPDATE bookings SET boarded = ? WHERE id = ?', [boarded, bookingId]); }
export async function getBoardingQueueForFlight(flightId) {
  const [rows] = await pool.query(`SELECT id, passenger_name, seat_numbers, boarding_group, boarded FROM bookings WHERE flight_id = ? ORDER BY boarding_group IS NULL, boarding_group ASC, id ASC`, [flightId]);
  return rows;
}
export async function getBookingsWithoutBoardingGroup(flightId) {
  const [rows] = await pool.query('SELECT id, seat_numbers FROM bookings WHERE flight_id = ? AND boarding_group IS NULL', [flightId]);
  return rows;
}
