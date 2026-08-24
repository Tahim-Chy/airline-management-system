import { useEffect, useState } from 'react';

const STATUSES = ['Reported', 'Investigating', 'Found', 'Returned', 'Closed'];
const STATUS_BADGE = {
  Reported: 'bg-warning text-dark',
  Investigating: 'bg-info text-dark',
  Found: 'bg-primary',
  Returned: 'bg-success',
  Closed: 'bg-secondary',
};

export default function AdminLostBaggagePage() {
  const [reports, setReports] = useState([]);

  const loadReports = () => {
    fetch('/api/lost-baggage').then((res) => res.json()).then(setReports);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleStatusChange = async (id, report_status) => {
    await fetch(`/api/lost-baggage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report_status }),
    });
    loadReports();
  };

  return (
    <div className="container mt-4">
      <h1>Lost &amp; Found Baggage</h1>

      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Passenger</th>
            <th>Tag</th>
            <th>Description</th>
            <th>Last Seen</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td>
                {r.passenger_name}
                <div className="text-muted small">{r.contact_email}</div>
              </td>
              <td>{r.baggage_tag || <span className="text-muted">Unknown</span>}</td>
              <td className="small">{r.description}</td>
              <td className="small">{r.last_seen_location || '—'}</td>
              <td>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={r.report_status}
                  onChange={(e) => handleStatusChange(r.id, e.target.value)}
                >
                  {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
                <span className={`badge ms-2 ${STATUS_BADGE[r.report_status]}`}>{r.report_status}</span>
              </td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={5} className="text-muted">No lost baggage reports yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
