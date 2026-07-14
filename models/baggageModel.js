import pool from '../lib/db';

export async function registerBaggage({ booking_id, weight_kg }) {
  const baggage_tag = 'BAG-' + Math.floor(100000 + Math.random() * 900000);
  const [result] = await pool.query(
    'INSERT INTO baggage (booking_id, baggage_tag, weight_kg, status) VALUES (?, ?, ?, ?)',
    [booking_id, baggage_tag, weight_kg, 'Checked-In']
  );
  return { id: result.insertId, baggage_tag };
}

export async function getBaggageByTag(tag) {
  const [rows] = await pool.query('SELECT * FROM baggage WHERE baggage_tag = ?', [tag]);
  return rows[0] || null;
}

export async function updateBaggageStatus(tag, status) {
  await pool.query('UPDATE baggage SET status = ? WHERE baggage_tag = ?', [status, tag]);
}

export async function getAllBaggage() {
  const [rows] = await pool.query('SELECT * FROM baggage ORDER BY created_at DESC');
  return rows;
}
