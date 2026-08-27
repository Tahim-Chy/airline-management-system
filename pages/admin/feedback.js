import { useEffect, useState } from 'react';
const STATUSES = ['New', 'In Review', 'Resolved'];
const STATUS_BADGE = { New: 'bg-secondary', 'In Review': 'bg-warning text-dark', Resolved: 'bg-success' };
const CATEGORY_BADGE = { Complaint: 'bg-danger', Compliment: 'bg-success', Suggestion: 'bg-info text-dark' };
export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([]);
  const loadFeedback = () => fetch('/api/feedback').then((res) => res.json()).then(setFeedback);
  useEffect(() => { loadFeedback(); }, []);
  const handleStatusChange = async (id, status) => { await fetch(`/api/feedback/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); loadFeedback(); };
  return (
    <div className="container mt-4">
      <h1>Feedback &amp; Complaints</h1>
      <table className="table table-striped align-middle">
        <thead><tr><th>From</th><th>Category</th><th>Message</th><th>Booking</th><th>Status</th></tr></thead>
        <tbody>
          {feedback.map((f) => (<tr key={f.id}><td>{f.name}<br /><span className="text-muted small">{f.email}</span></td><td><span className={`badge ${CATEGORY_BADGE[f.category]}`}>{f.category}</span></td><td className="small">{f.message}</td><td>{f.booking_id || '—'}</td><td><select className="form-select form-select-sm" style={{ width: 'auto' }} value={f.status} onChange={(e) => handleStatusChange(f.id, e.target.value)}>{STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}</select><span className={`badge ms-2 ${STATUS_BADGE[f.status]}`}>{f.status}</span></td></tr>))}
          {feedback.length === 0 && <tr><td colSpan={5} className="text-muted">No feedback yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
