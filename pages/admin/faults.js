import { useEffect, useState } from 'react';

const STATUSES = ['Reported', 'Under Repair', 'Resolved'];
const STATUS_BADGE = { Reported: 'bg-secondary', 'Under Repair': 'bg-warning text-dark', Resolved: 'bg-success' };
const SEVERITY_BADGE = { Minor: 'bg-info text-dark', Major: 'bg-warning text-dark', Critical: 'bg-danger' };

export default function AdminFaultsPage() {
  const [faults, setFaults] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const loadFaults = () => {
    fetch('/api/faults').then((res) => res.json()).then(setFaults);
  };

  useEffect(() => {
    loadFaults();
  }, []);

  const handleStatusChange = async (id, status) => {
    const res = await fetch(`/api/faults/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    setMessageType(res.ok ? 'success' : 'danger');
    setMessage(status === 'Resolved' ? 'Fault resolved — aircraft is Available again.' : data.message || data.error);
    loadFaults();
  };

  return (
    <div className="container mt-4">
      <h1>Aircraft Fault Reports</h1>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}

      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Aircraft</th>
            <th>Description</th>
            <th>Severity</th>
            <th>Reported By</th>
            <th>Reported At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {faults.map((f) => (
            <tr key={f.id}>
              <td>{f.tail_number} ({f.model})</td>
              <td className="small">{f.fault_description}</td>
              <td><span className={`badge ${SEVERITY_BADGE[f.severity]}`}>{f.severity}</span></td>
              <td>{f.reported_by_name || 'Unknown'}</td>
              <td>{new Date(f.reported_at).toLocaleString()}</td>
              <td>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={f.status}
                  onChange={(e) => handleStatusChange(f.id, e.target.value)}
                >
                  {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
                <span className={`badge ms-2 ${STATUS_BADGE[f.status]}`}>{f.status}</span>
              </td>
            </tr>
          ))}
          {faults.length === 0 && (
            <tr><td colSpan={6} className="text-muted">No fault reports yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
