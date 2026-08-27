import { useEffect, useState } from 'react';
import { useSearchAndPaginate } from '../../lib/useSearchAndPaginate';
import { SearchBox, PaginationBar } from '../../components/TableControls';
import { SkeletonTableRows } from '../../components/Skeleton';
import { useToast } from '../../components/ToastProvider';

const STATUSES = ['Reported', 'Under Repair', 'Resolved'];
const STATUS_BADGE = { Reported: 'bg-secondary', 'Under Repair': 'bg-warning text-dark', Resolved: 'bg-success' };
const SEVERITY_BADGE = { Minor: 'bg-info text-dark', Major: 'bg-warning text-dark', Critical: 'bg-danger' };

export default function AdminFaultsPage() {
  const { showToast } = useToast();
  const [faults, setFaults] = useState(null);

  const loadFaults = () => fetch('/api/faults').then((res) => res.json()).then(setFaults);
  useEffect(() => { loadFaults(); }, []);

  const { query, setQuery, page, setPage, totalPages, totalResults, pageData } = useSearchAndPaginate(
    faults || [],
    (f) => [f.tail_number, f.model, f.fault_description, f.severity, f.status],
    8
  );

  const handleStatusChange = async (id, status) => {
    const res = await fetch(`/api/faults/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    const data = await res.json();
    showToast(res.ok ? (status === 'Resolved' ? 'Fault resolved — aircraft is Available again.' : 'Status updated.') : data.error, res.ok ? 'success' : 'danger');
    loadFaults();
  };

  return (
    <div className="container mt-4 fade-in">
      <h1>Aircraft Fault Reports</h1>
      <SearchBox value={query} onChange={setQuery} placeholder="Search by aircraft, description, or severity…" />
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Aircraft</th><th>Description</th><th>Severity</th><th>Reported By</th><th>Reported At</th><th>Status</th></tr></thead>
          <tbody>
            {faults === null && <SkeletonTableRows rows={5} columns={6} />}
            {faults !== null && pageData.map((f) => (
              <tr key={f.id}>
                <td>{f.tail_number} ({f.model})</td>
                <td className="small">{f.fault_description}</td>
                <td><span className={`badge ${SEVERITY_BADGE[f.severity]}`}>{f.severity}</span></td>
                <td>{f.reported_by_name || 'Unknown'}</td>
                <td>{new Date(f.reported_at).toLocaleString()}</td>
                <td>
                  <select className="form-select form-select-sm" style={{ width: 'auto' }} value={f.status} onChange={(e) => handleStatusChange(f.id, e.target.value)}>
                    {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                  <span className={`badge ms-2 ${STATUS_BADGE[f.status]}`}>{f.status}</span>
                </td>
              </tr>
            ))}
            {faults !== null && faults.length === 0 && (<tr><td colSpan={6} className="text-muted">No fault reports yet.</td></tr>)}
          </tbody>
        </table>
      </div>
      <PaginationBar page={page} totalPages={totalPages} totalResults={totalResults} onPageChange={setPage} />
    </div>
  );
}
