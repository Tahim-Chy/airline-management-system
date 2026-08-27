import { useEffect, useState } from 'react';
const STATUSES = ['Scheduled', 'Boarding', 'Delayed', 'Departed', 'Landed', 'Cancelled'];
const STATUS_BADGE = { Scheduled: 'bg-secondary', Boarding: 'bg-primary', Delayed: 'bg-warning text-dark', Departed: 'bg-info text-dark', Landed: 'bg-success', Cancelled: 'bg-danger' };
export default function AdminFlightStatusPage() {
  const [flights, setFlights] = useState([]); const [message, setMessage] = useState(''); const [messageType, setMessageType] = useState('info');
  const loadFlights = () => fetch('/api/flights').then((res) => res.json()).then(setFlights);
  useEffect(() => { loadFlights(); }, []);
  const handleStatusChange = async (flightId, newStatus) => {
    const res = await fetch(`/api/flights/${flightId}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
    const data = await res.json();
    if (res.ok) { setMessageType('success'); setMessage(`Status updated to ${newStatus}.` + (['Landed','Cancelled'].includes(newStatus) ? ' Aircraft and gate released.' : '')); loadFlights(); }
    else { setMessageType('danger'); setMessage(data.error); }
  };
  return (
    <div className="container mt-4">
      <h1>Update Flight Status</h1>
      <p className="text-muted">Marking a flight Landed or Cancelled automatically frees its aircraft and gate.</p>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      <table className="table table-striped align-middle">
        <thead><tr><th>Flight</th><th>Route</th><th>Current Status</th><th>Change To</th></tr></thead>
        <tbody>{flights.map((f) => (<tr key={f.id}><td>{f.flight_number}</td><td>{f.origin} → {f.destination}</td><td><span className={`badge ${STATUS_BADGE[f.status] || 'bg-secondary'}`}>{f.status}</span></td><td><select className="form-select form-select-sm" style={{ width: 'auto' }} value={f.status} onChange={(e) => handleStatusChange(f.id, e.target.value)}>{STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}</select></td></tr>))}</tbody>
      </table>
    </div>
  );
}
