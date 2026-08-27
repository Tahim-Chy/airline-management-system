import pool from '../lib/db';
export async function createUser({ name, email, passwordHash, role }) {
  const [result] = await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name, email, passwordHash, role]);
  return result.insertId;
}
export async function findUserByEmail(email) { const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]); return rows[0] || null; }
export async function findUserById(id) { const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]); return rows[0] || null; }
export async function getAllCrew() { const [rows] = await pool.query("SELECT id, name, email FROM users WHERE role = 'crew' ORDER BY name"); return rows; }

// New: forgot-password flow
export async function setResetToken(userId, token, expiry) {
  await pool.query('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?', [token, expiry, userId]);
}
export async function findUserByResetToken(token) {
  const [rows] = await pool.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()', [token]);
  return rows[0] || null;
}
export async function updatePasswordAndClearToken(userId, passwordHash) {
  await pool.query('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?', [passwordHash, userId]);
}
