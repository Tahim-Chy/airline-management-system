import { useEffect, useState } from 'react';
const TYPES = ['Routine Inspection', 'Repair', 'Overhaul', 'Other'];
const STATUS_BADGE = { Scheduled: 'bg-warning text-dark', 'In Progress': 'bg-info text-dark', Completed: 'bg-success' };
export default function AdminMaintenancePage() {
  const [records, setRecords] = useState([]); const [aircraft, setAircraft] = useState([]);
  const [form, setForm] = useState({ aircraft_id: '', maintenance_type: 'Routine Inspection', scheduled_date: '', notes: '' });
  const [message, setMessage] = useState(''); const [messageType, setMessageType] = useState('info');
  const loadAll = () => {
    fetch('/api/maintenance').then((res) => res.json()).then(setRecords);
    fetch('/api/aircraft').then((res) => res.json()).then(setAircraft);
  };
  useEffect(() => { loadAll(); }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/maintenance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMessageType('success'); setMessage(data.message); setForm({ aircraft_id: '', maintenance_type: 'Routine Inspection', scheduled_date: '', notes: '' }); loadAll(); }
    else { setMessageType('danger'); setMessage(data.error); }
  };
  const handleComplete = async (id) => {
    const res = await fetch(`/api/maintenance/${id}/complete`, { method: 'PATCH' });
    const data = await res.json();
    setMessageType(res.ok ? 'success' : 'danger'); setMessage(data.message || data.error); loadAll();
  };
  return (
    <div className="container mt-4">
      <h1>Aircraft Maintenance Scheduling</h1>
      <p className="text-muted">Scheduling maintenance marks that aircraft &quot;In Maintenance&quot; and pulls it out of the assignment pool until completed.</p>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <h5>Schedule Maintenance</h5>
        <div className="row g-2">
          <div className="col-md-3"><select className="form-select" value={form.aircraft_id} onChange={(e) => setForm({ ...form, aircraft_id: e.target.value })} required><option value="">Aircraft</option>{aircraft.map((a) => (<option key={a.id} value={a.id}>{a.tail_number} ({a.status})</option>))}</select></div>
          <div className="col-md-3"><select className="form-select" value={form.maintenance_type} onChange={(e) => setForm({ ...form, maintenance_type: e.target.value })}>{TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}</select></div>
          <div className="col-md-3"><label className="form-label">Scheduled Date</label><input className="form-control" type="date" required value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} /></div>
          <div className="col-md-3"><label className="form-label">Notes</label><input className="form-control" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary mt-3" type="submit">Schedule</button>
      </form>
      <table className="table table-striped align-middle">
        <thead><tr><th>Aircraft</th><th>Type</th><th>Scheduled</th><th>Completed</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {records.map((r) => (<tr key={r.id}><td>{r.tail_number} ({r.model})</td><td>{r.maintenance_type}</td><td>{r.scheduled_date}</td><td>{r.completed_date || '—'}</td><td><span className={`badge ${STATUS_BADGE[r.status]}`}>{r.status}</span></td><td>{r.status !== 'Completed' && <button className="btn btn-sm btn-success" onClick={() => handleComplete(r.id)}>Mark Complete</button>}</td></tr>))}
          {records.length === 0 && <tr><td colSpan={6} className="text-muted">No maintenance records yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
