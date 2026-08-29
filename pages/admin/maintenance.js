import { useEffect, useState } from 'react';
import { useSearchAndPaginate } from '../../lib/useSearchAndPaginate';
import { SearchBox, PaginationBar } from '../../components/TableControls';
import { SkeletonTableRows } from '../../components/Skeleton';
import { useToast } from '../../components/ToastProvider';
import { useRequireRole } from '../../lib/useRequireRole';
import { authFetch } from '../../lib/authFetch';
import AccessDenied from '../../components/AccessDenied';

const TYPES = ['Routine Inspection', 'Repair', 'Overhaul', 'Other'];
const STATUS_BADGE = { Scheduled: 'bg-warning text-dark', 'In Progress': 'bg-info text-dark', Completed: 'bg-success' };

export default function AdminMaintenancePage() {
  const status = useRequireRole(['admin']);
  const { showToast } = useToast();
  const [records, setRecords] = useState(null);
  const [aircraft, setAircraft] = useState([]);
  const [form, setForm] = useState({ aircraft_id: '', maintenance_type: 'Routine Inspection', scheduled_date: '', notes: '' });

  const loadAll = () => {
    authFetch('/api/maintenance').then((res) => (res.ok ? res.json() : [])).then(setRecords);
    authFetch('/api/aircraft').then((res) => res.json()).then(setAircraft);
  };
  useEffect(() => { loadAll(); }, []);

  const { query, setQuery, page, setPage, totalPages, totalResults, pageData } = useSearchAndPaginate(
    records || [],
    (r) => [r.tail_number, r.model, r.maintenance_type, r.status],
    8
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await authFetch('/api/maintenance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message, 'success');
      setForm({ aircraft_id: '', maintenance_type: 'Routine Inspection', scheduled_date: '', notes: '' });
      loadAll();
    } else {
      showToast(data.error, 'danger');
    }
  };

  const handleComplete = async (id) => {
    const res = await authFetch(`/api/maintenance/${id}/complete`, { method: 'PATCH' });
    const data = await res.json();
    showToast(res.ok ? data.message : data.error, res.ok ? 'success' : 'danger');
    loadAll();
  };

  if (status === 'checking' || status === 'guest') return null;
  if (status === 'unauthorized') return <AccessDenied />;

  return (
    <div className="container mt-4 fade-in">
      <h1>Aircraft Maintenance Scheduling</h1>
      <p className="text-muted">Scheduling maintenance marks that aircraft &quot;In Maintenance&quot; and pulls it out of the assignment pool until completed.</p>

      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <h5>Schedule Maintenance</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <select className="form-select" value={form.aircraft_id} onChange={(e) => setForm({ ...form, aircraft_id: e.target.value })} required>
              <option value="">Aircraft</option>
              {aircraft.map((a) => (<option key={a.id} value={a.id}>{a.tail_number} ({a.status})</option>))}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={form.maintenance_type} onChange={(e) => setForm({ ...form, maintenance_type: e.target.value })}>
              {TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Scheduled Date</label>
            <input className="form-control" type="date" required value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Notes</label>
            <input className="form-control" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <button className="btn btn-primary mt-3" type="submit">Schedule</button>
      </form>

      <SearchBox value={query} onChange={setQuery} placeholder="Search by aircraft or type…" />
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Aircraft</th><th>Type</th><th>Scheduled</th><th>Completed</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {records === null && <SkeletonTableRows rows={5} columns={6} />}
            {records !== null && pageData.map((r) => (
              <tr key={r.id}>
                <td>{r.tail_number} ({r.model})</td>
                <td>{r.maintenance_type}</td>
                <td>{r.scheduled_date}</td>
                <td>{r.completed_date || '—'}</td>
                <td><span className={`badge ${STATUS_BADGE[r.status]}`}>{r.status}</span></td>
                <td>{r.status !== 'Completed' && <button className="btn btn-sm btn-success" onClick={() => handleComplete(r.id)}>Mark Complete</button>}</td>
              </tr>
            ))}
            {records !== null && records.length === 0 && (<tr><td colSpan={6} className="text-muted">No maintenance records yet.</td></tr>)}
          </tbody>
        </table>
      </div>
      <PaginationBar page={page} totalPages={totalPages} totalResults={totalResults} onPageChange={setPage} />
    </div>
  );
}
