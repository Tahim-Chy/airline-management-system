import { useEffect, useState } from 'react';
const STATUSES = ['Pending', 'Approved', 'Fulfilled'];
const STATUS_BADGE = { Pending: 'bg-warning text-dark', Approved: 'bg-info text-dark', Fulfilled: 'bg-success' };
export default function AdminAssistanceRequestsPage() {
  const [requests, setRequests] = useState([]);
  const loadRequests = () => fetch('/api/assistance').then((res) => res.json()).then(setRequests);
  useEffect(() => { loadRequests(); }, []);
  const handleStatusChange = async (id, status) => { await fetch(`/api/assistance/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); loadRequests(); };
  return (
    <div className="container mt-4">
      <h1>Special Assistance Requests</h1>
      <table className="table table-striped align-middle">
        <thead><tr><th>Passenger</th><th>Flight</th><th>Type</th><th>Notes</th><th>Status</th></tr></thead>
        <tbody>
          {requests.map((r) => (<tr key={r.id}><td>{r.passenger_name}</td><td>{r.flight_number}</td><td>{r.request_type}</td><td className="text-muted small">{r.notes || '—'}</td><td><select className="form-select form-select-sm" style={{ width: 'auto' }} value={r.status} onChange={(e) => handleStatusChange(r.id, e.target.value)}>{STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}</select><span className={`badge ms-2 ${STATUS_BADGE[r.status]}`}>{r.status}</span></td></tr>))}
          {requests.length === 0 && <tr><td colSpan={5} className="text-muted">No assistance requests yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
