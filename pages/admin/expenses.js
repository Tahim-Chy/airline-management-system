import { useEffect, useState } from 'react';
const CATEGORIES = ['Fuel', 'Maintenance', 'Salaries', 'Airport Fees', 'Catering', 'Other'];
export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ category: 'Fuel', description: '', amount: '', expense_date: '' });
  const [message, setMessage] = useState(''); const [messageType, setMessageType] = useState('info');
  const loadExpenses = () => fetch('/api/expenses').then((res) => res.json()).then(setExpenses);
  useEffect(() => { loadExpenses(); }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/expenses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMessageType('success'); setMessage('Expense recorded.'); setForm({ category: 'Fuel', description: '', amount: '', expense_date: '' }); loadExpenses(); }
    else { setMessageType('danger'); setMessage(data.error); }
  };
  return (
    <div className="container mt-4">
      <h1>Log an Expense</h1>
      <p className="text-muted">Feeds directly into the Revenue &amp; Expense Analytics dashboard.</p>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <div className="row g-2">
          <div className="col-md-3"><select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}</select></div>
          <div className="col-md-4"><input className="form-control" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="col-md-2"><input className="form-control" type="number" step="0.01" placeholder="Amount ($)" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
          <div className="col-md-3"><input className="form-control" type="date" required value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary mt-3" type="submit">Record Expense</button>
      </form>
      <table className="table table-striped align-middle">
        <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
        <tbody>{expenses.map((e) => (<tr key={e.id}><td>{e.expense_date}</td><td><span className="badge bg-secondary">{e.category}</span></td><td className="small">{e.description || '—'}</td><td>${Number(e.amount).toFixed(2)}</td></tr>))}
        {expenses.length === 0 && <tr><td colSpan={4} className="text-muted">No expenses logged yet.</td></tr>}</tbody>
      </table>
    </div>
  );
}
