import { useEffect, useState } from 'react';
import { useSearchAndPaginate } from '../../lib/useSearchAndPaginate';
import { SearchBox, PaginationBar } from '../../components/TableControls';
import { SkeletonTableRows } from '../../components/Skeleton';
import { useToast } from '../../components/ToastProvider';

const STATUSES = ['Pending', 'Approved', 'Fulfilled'];
const STATUS_BADGE = { Pending: 'bg-warning text-dark', Approved: 'bg-info text-dark', Fulfilled: 'bg-success' };

export default function AdminAssistanceRequestsPage() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState(null);

  const loadRequests = () => fetch('/api/assistance').then((res) => res.json()).then(setRequests);
  useEffect(() => { loadRequests(); }, []);

  const { query, setQuery, page, setPage, totalPages, totalResults, pageData } = useSearchAndPaginate(
    requests || [],
    (r) => [r.passenger_name, r.flight_number, r.request_type, r.status],
    8
  );

  const handleStatusChange = async (id, status) => {
    await fetch(`/api/assistance/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    showToast('Status updated.', 'success');
    loadRequests();
  };

  return (
    <div className="container mt-4 fade-in">
      <h1>Special Assistance Requests</h1>
      <SearchBox value={query} onChange={setQuery} placeholder="Search by passenger, flight, or type…" />
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Passenger</th><th>Flight</th><th>Type</th><th>Notes</th><th>Status</th></tr></thead>
          <tbody>
            {requests === null && <SkeletonTableRows rows={5} columns={5} />}
            {requests !== null && pageData.map((r) => (
              <tr key={r.id}>
                <td>{r.passenger_name}</td>
                <td>{r.flight_number}</td>
                <td>{r.request_type}</td>
                <td className="text-muted small">{r.notes || '—'}</td>
                <td>
                  <select className="form-select form-select-sm" style={{ width: 'auto' }} value={r.status} onChange={(e) => handleStatusChange(r.id, e.target.value)}>
                    {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                  <span className={`badge ms-2 ${STATUS_BADGE[r.status]}`}>{r.status}</span>
                </td>
              </tr>
            ))}
            {requests !== null && requests.length === 0 && (<tr><td colSpan={5} className="text-muted">No assistance requests yet.</td></tr>)}
          </tbody>
        </table>
      </div>
      <PaginationBar page={page} totalPages={totalPages} totalResults={totalResults} onPageChange={setPage} />
    </div>
  );
}
