import pool from '../lib/db';
const POINTS_PER_DOLLAR = 0.1;
export function tierForPoints(points) { if (points >= 5000) return 'Platinum'; if (points >= 2000) return 'Gold'; if (points >= 500) return 'Silver'; return 'Bronze'; }
export async function getAccountByEmail(email) { const [rows] = await pool.query('SELECT * FROM loyalty_accounts WHERE email = ?', [email]); return rows[0] || null; }
export async function getOrCreateAccount(email, name) {
  const existing = await getAccountByEmail(email);
  if (existing) return existing;
  await pool.query('INSERT INTO loyalty_accounts (email, name, points) VALUES (?, ?, 0)', [email, name]);
  return getAccountByEmail(email);
}
export async function addPoints(email, pointsToAdd) { await pool.query('UPDATE loyalty_accounts SET points = points + ? WHERE email = ?', [pointsToAdd, email]); return getAccountByEmail(email); }
export function pointsForSpend(totalPrice) { return Math.round(Number(totalPrice) * POINTS_PER_DOLLAR); }
