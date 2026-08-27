import pool from '../lib/db';
const FREE_ALLOWANCE_KG = 23, OVERWEIGHT_RATE_PER_KG = 15, ADDITIONAL_BAG_FLAT_FEE = 50;
export function calculateExtraFee(weightKg, bagNumberForThisBooking) {
  let fee = 0;
  if (bagNumberForThisBooking > 1) fee += ADDITIONAL_BAG_FLAT_FEE;
  if (weightKg > FREE_ALLOWANCE_KG) fee += (weightKg - FREE_ALLOWANCE_KG) * OVERWEIGHT_RATE_PER_KG;
  return Number(fee.toFixed(2));
}
export async function getBaggageCountForBooking(bookingId) { const [rows] = await pool.query('SELECT COUNT(*) AS count FROM baggage WHERE booking_id = ?', [bookingId]); return rows[0].count; }
export async function registerBaggage({ booking_id, weight_kg, extra_fee }) {
  const baggage_tag = 'BAG-' + Math.floor(100000 + Math.random() * 900000);
  const [result] = await pool.query('INSERT INTO baggage (booking_id, baggage_tag, weight_kg, extra_fee, status) VALUES (?, ?, ?, ?, ?)', [booking_id, baggage_tag, weight_kg, extra_fee, 'Checked-In']);
  return { id: result.insertId, baggage_tag };
}
export async function getBaggageByTag(tag) { const [rows] = await pool.query('SELECT * FROM baggage WHERE baggage_tag = ?', [tag]); return rows[0] || null; }
export async function updateBaggageStatus(tag, status) { await pool.query('UPDATE baggage SET status = ? WHERE baggage_tag = ?', [status, tag]); }
export async function getAllBaggage() { const [rows] = await pool.query('SELECT * FROM baggage ORDER BY created_at DESC'); return rows; }
