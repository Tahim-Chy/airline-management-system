import { useEffect, useState } from 'react';

const ROLES = ['Pilot', 'Co-Pilot', 'Flight Attendant', 'Purser'];

export default function CrewSchedulePage() {
  const [flights, setFlights] = useState([]);
  const [crew, setCrew] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ flight_id: '', crew_id: '', role_on_flight: 'Flight Attendant' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const loadAll = () => {
    fetch('/api/flights').then((res) => res.json()).then(setFlights);
    fetch('/api/crew/list').then((res) => res.json()).then(setCrew);
    fetch('/api/crew-assignments').then((res) => res.json()).then(setAssignments);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/crew-assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMessageType('success');
      setMessage('Crew member assigned.');
      setForm({ flight_id: '', crew_id: '', role_on_flight: 'Flight Attendant' });
      loadAll();
    } else {
      setMessageType('danger');
      setMessage(data.error);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this crew assignment?')) return;
    await fetch(`/api/crew-assignments/${id}`, { method: 'DELETE' });
    loadAll();
  };

  return (
    <div className="container mt-4">
      <h1>Crew Scheduling</h1>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      {crew.length === 0 && (
        <div className="alert alert-warning">
          No crew accounts exist yet — register a few users with the &quot;Crew&quot; role at /register first.
        </div>
      )}

      <form onSubmit={handleSubmit} className="border rounded p-3 mb-4">
        <h5>Assign Crew to a Flight</h5>
        <div className="row g-2">
          <div className="col-md-4">
            <select
              className="form-select"
              value={form.flight_id}
              onChange={(e) => setForm({ ...form, flight_id: e.target.value })}
              required
            >
              <option value="">Select Flight</option>
              {flights.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.flight_number} — {f.origin} → {f.destination}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={form.crew_id}
              onChange={(e) => setForm({ ...form, crew_id: e.target.value })}
              required
            >
              <option value="">Select Crew Member</option>
              {crew.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={form.role_on_flight}
              onChange={(e) => setForm({ ...form, role_on_flight: e.target.value })}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn btn-primary mt-3" type="submit">
          Assign
        </button>
      </form>

      <h5>Current Crew Assignments</h5>
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Flight</th>
            <th>Departure</th>
            <th>Crew Member</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a.id}>
              <td>{a.flight_number} ({a.origin} → {a.destination})</td>
              <td>{new Date(a.departure_time).toLocaleString()}</td>
              <td>{a.crew_name}</td>
              <td>
                <span className="badge bg-primary">{a.role_on_flight}</span>
              </td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => handleRemove(a.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {assignments.length === 0 && (
            <tr>
              <td colSpan={5} className="text-muted">
                No crew assignments yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
