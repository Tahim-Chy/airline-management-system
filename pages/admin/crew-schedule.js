import { useEffect, useState } from 'react';
import { useSearchAndPaginate } from '../../lib/useSearchAndPaginate';
import { SearchBox, PaginationBar } from '../../components/TableControls';
import { SkeletonTableRows } from '../../components/Skeleton';
import { useToast } from '../../components/ToastProvider';

const ROLES = ['Pilot', 'Co-Pilot', 'Flight Attendant', 'Purser'];

export default function CrewSchedulePage() {
  const { showToast } = useToast();
  const [flights, setFlights] = useState([]);
  const [crew, setCrew] = useState([]);
  const [assignments, setAssignments] = useState(null);
  const [form, setForm] = useState({ flight_id: '', crew_id: '', role_on_flight: 'Flight Attendant' });

  const loadAll = () => {
    fetch('/api/flights').then((res) => res.json()).then(setFlights);
    fetch('/api/crew/list').then((res) => res.json()).then(setCrew);
    fetch('/api/crew-assignments').then((res) => res.json()).then(setAssignments);
  };
  useEffect(() => { loadAll(); }, []);

  const { query, setQuery, page, setPage, totalPages, totalResults, pageData } = useSearchAndPaginate(
    assignments || [],
    (a) => [a.flight_number, a.origin, a.destination, a.crew_name, a.role_on_flight],
    8
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/crew-assignments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) {
      showToast('Crew member assigned.', 'success');
      setForm({ flight_id: '', crew_id: '', role_on_flight: 'Flight Attendant' });
      loadAll();
    } else {
      showToast(data.error, 'danger');
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this crew assignment?')) return;
    await fetch(`/api/crew-assignments/${id}`, { method: 'DELETE' });
    showToast('Assignment removed.', 'success');
    loadAll();
  };

  return (
    <div className="container mt-4 fade-in">
      <h1>Crew Scheduling</h1>
      {crew.length === 0 && <div className="alert alert-warning">No crew accounts exist yet — register a few users with the &quot;Crew&quot; role at /register first.</div>}

      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <h5>Assign Crew to a Flight</h5>
        <div className="row g-2">
          <div className="col-md-4">
            <select className="form-select" value={form.flight_id} onChange={(e) => setForm({ ...form, flight_id: e.target.value })} required>
              <option value="">Select Flight</option>
              {flights.map((f) => (<option key={f.id} value={f.id}>{f.flight_number} — {f.origin} → {f.destination}</option>))}
            </select>
          </div>
          <div className="col-md-4">
            <select className="form-select" value={form.crew_id} onChange={(e) => setForm({ ...form, crew_id: e.target.value })} required>
              <option value="">Select Crew Member</option>
              {crew.map((c) => (<option key={c.id} value={c.id}>{c.name} ({c.email})</option>))}
            </select>
          </div>
          <div className="col-md-4">
            <select className="form-select" value={form.role_on_flight} onChange={(e) => setForm({ ...form, role_on_flight: e.target.value })}>
              {ROLES.map((r) => (<option key={r} value={r}>{r}</option>))}
            </select>
          </div>
        </div>
        <button className="btn btn-primary mt-3" type="submit">Assign</button>
      </form>

      <SearchBox value={query} onChange={setQuery} placeholder="Search by flight or crew member…" />
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Flight</th><th>Departure</th><th>Crew Member</th><th>Role</th><th></th></tr></thead>
          <tbody>
            {assignments === null && <SkeletonTableRows rows={5} columns={5} />}
            {assignments !== null && pageData.map((a) => (
              <tr key={a.id}>
                <td>{a.flight_number} ({a.origin} → {a.destination})</td>
                <td>{new Date(a.departure_time).toLocaleString()}</td>
                <td>{a.crew_name}</td>
                <td><span className="badge bg-primary">{a.role_on_flight}</span></td>
                <td><button className="btn btn-sm btn-danger" onClick={() => handleRemove(a.id)}>Remove</button></td>
              </tr>
            ))}
            {assignments !== null && assignments.length === 0 && (<tr><td colSpan={5} className="text-muted">No crew assignments yet.</td></tr>)}
          </tbody>
        </table>
      </div>
      <PaginationBar page={page} totalPages={totalPages} totalResults={totalResults} onPageChange={setPage} />
    </div>
  );
}
