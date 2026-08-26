import { addExpense, getAllExpenses } from '../models/expenseModel';

const CATEGORIES = ['Fuel', 'Maintenance', 'Salaries', 'Airport Fees', 'Catering', 'Other'];

export async function create(req, res) {
  try {
    const { category, description, amount, expense_date } = req.body;
    if (!category || !amount || !expense_date) {
      return res.status(400).json({ error: 'Category, amount, and date are required' });
    }
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `Category must be one of: ${CATEGORIES.join(', ')}` });
    }
    const id = await addExpense({ category, description, amount, expense_date });
    res.status(201).json({ message: 'Expense recorded', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record expense' });
  }
}

export async function list(req, res) {
  try {
    res.status(200).json(await getAllExpenses());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
}
