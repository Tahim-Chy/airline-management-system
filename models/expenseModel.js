import pool from '../lib/db';

export async function addExpense({ category, description, amount, expense_date }) {
  const [result] = await pool.query(
    'INSERT INTO expenses (category, description, amount, expense_date) VALUES (?, ?, ?, ?)',
    [category, description, amount, expense_date]
  );
  return result.insertId;
}

export async function getAllExpenses() {
  const [rows] = await pool.query('SELECT * FROM expenses ORDER BY expense_date DESC');
  return rows;
}

export async function getExpensesByMonth() {
  const [rows] = await pool.query(
    `SELECT DATE_FORMAT(expense_date, '%Y-%m') AS month, SUM(amount) AS total
     FROM expenses GROUP BY month ORDER BY month`
  );
  return rows;
}

export async function getTotalExpenses() {
  const [rows] = await pool.query('SELECT COALESCE(SUM(amount), 0) AS total FROM expenses');
  return Number(rows[0].total);
}
