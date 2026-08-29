import { useEffect, useState } from 'react';
import { useRequireRole } from '../../lib/useRequireRole';
import { authFetch } from '../../lib/authFetch';
import AccessDenied from '../../components/AccessDenied';
export default function AdminAssignmentsPage() {
  const status = useRequireRole(['admin']);
  const [flights, setFlights] = useState([]); const [aircraft, setAircraft] = useState([]); const [gates, setGates] = useState([]); const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ flight_id: '', aircraft_id: '', gate_id: '' });
  const [message, setMessage] = useState(''); const [messageType, setMessageType] = useState('info');
  const loadAll = () => {
    authFetch('/api/flights').then((res) => res.json()).then(setFlights);
    authFetch('/api/aircraft').then((res) => res.json()).then(setAircraft);
    authFetch('/api/gates').then((res) => res.json()).then(setGates);
    authFetch('/api/flights/assignments').then((res) => res.json()).then(setAssignments);
  };
  useEffect(() => { loadAll(); }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.flight_id) { setMessageType('danger'); setMessage('Choose a flight first.'); return; }
    const res = await authFetch('/api/flights/assign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMessageType('success'); setMessage('Assignment saved.'); setForm({ flight_id: '', aircraft_id: '', gate_id: '' }); loadAll(); }
    else { setMessageType('danger'); setMessage(data.error); }
  };
  const availableAircraft = aircraft.filter((a) => a.status === 'Available');
  const availableGates = gates.filter((g) => g.status === 'Available');
  if (status === 'checking' || status === 'guest') return null;
  if (status === 'unauthorized') return <AccessDenied />;

  return (
    <div className="container mt-4">
      <h1>Aircraft &amp; Gate Assignment</h1>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <h5>Assign a Flight</h5>
        <div className="row g-2">
          <div className="col-md-4"><select className="form-select" value={form.flight_id} onChange={(e) => setForm({ ...form, flight_id: e.target.value })} required><option value="">Select Flight</option>{flights.map((f) => (<option key={f.id} value={f.id}>{f.flight_number} — {f.origin} → {f.destination}</option>))}</select></div>
          <div className="col-md-4"><select className="form-select" value={form.aircraft_id} onChange={(e) => setForm({ ...form, aircraft_id: e.target.value })}><option value="">Select Aircraft (available only)</option>{availableAircraft.map((a) => (<option key={a.id} value={a.id}>{a.tail_number} — {a.model}</option>))}</select></div>
          <div className="col-md-4"><select className="form-select" value={form.gate_id} onChange={(e) => setForm({ ...form, gate_id: e.target.value })}><option value="">Select Gate (available only)</option>{availableGates.map((g) => (<option key={g.id} value={g.id}>Gate {g.gate_number} — {g.terminal}</option>))}</select></div>
        </div>
        <button className="btn btn-primary mt-3" type="submit">Save Assignment</button>
      </form>
      <h5>Current Assignments</h5>
      <div className="table-responsive">
<table className="table table-striped align-middle">
        <thead><tr><th>Flight</th><th>Route</th><th>Departure</th><th>Aircraft</th><th>Gate</th></tr></thead>
        <tbody>{assignments.map((f) => (<tr key={f.id}><td>{f.flight_number}</td><td>{f.origin} → {f.destination}</td><td>{new Date(f.departure_time).toLocaleString()}</td><td>{f.tail_number ? <span className="badge bg-primary">{f.tail_number} ({f.model})</span> : <span className="text-muted">Not assigned</span>}</td><td>{f.gate_number ? <span className="badge bg-info text-dark">Gate {f.gate_number}</span> : <span className="text-muted">Not assigned</span>}</td></tr>))}</tbody>
      </table>
</div>
    </div>
  );
}
