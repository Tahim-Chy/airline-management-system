import { useEffect, useState } from 'react';
const GROUP_BADGE = { 1: 'bg-warning text-dark', 2: 'bg-info text-dark', 3: 'bg-secondary', General: 'bg-light text-dark border' };
export default function BoardingQueuePage() {
  const [flights, setFlights] = useState([]); const [flightId, setFlightId] = useState(''); const [queue, setQueue] = useState([]);
  const [message, setMessage] = useState(''); const [messageType, setMessageType] = useState('info');
  useEffect(() => { fetch('/api/flights').then((res) => res.json()).then(setFlights); }, []);
  const loadQueue = (id) => { if (!id) return; fetch(`/api/boarding/queue?flight_id=${id}`).then((res) => res.json()).then(setQueue); };
  const handleFlightChange = (e) => { const id = e.target.value; setFlightId(id); loadQueue(id); };
  const handleAssignGroups = async () => {
    if (!flightId) return;
    const res = await fetch('/api/boarding/assign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ flight_id: flightId }) });
    const data = await res.json();
    setMessageType(res.ok ? 'success' : 'danger'); setMessage(data.message || data.error); loadQueue(flightId);
  };
  const handleToggleBoarded = async (booking) => {
    await fetch(`/api/boarding/${booking.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ boarded: !booking.boarded }) });
    loadQueue(flightId);
  };
  return (
    <div className="container mt-4">
      <h1>Priority Boarding &amp; Queue</h1>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      <div className="row g-2 align-items-end mb-3">
        <div className="col-md-6"><label className="form-label">Flight</label><select className="form-select" value={flightId} onChange={handleFlightChange}><option value="">Select a flight</option>{flights.map((f) => (<option key={f.id} value={f.id}>{f.flight_number} — {f.origin} → {f.destination}</option>))}</select></div>
        <div className="col-md-4"><button className="btn btn-primary" onClick={handleAssignGroups} disabled={!flightId}>Assign Boarding Groups</button></div>
      </div>
      {flightId && (
        <table className="table table-striped align-middle">
          <thead><tr><th>Group</th><th>Passenger</th><th>Seat</th><th>Boarded</th><th></th></tr></thead>
          <tbody>
            {queue.map((q) => (<tr key={q.id} className={q.boarded ? 'text-muted' : ''}><td><span className={`badge ${GROUP_BADGE[q.boarding_group] || 'bg-light text-dark border'}`}>{q.boarding_group || 'Not assigned'}</span></td><td>{q.passenger_name}</td><td>{q.seat_numbers || '—'}</td><td>{q.boarded ? '✓ Boarded' : 'Waiting'}</td><td><button className={`btn btn-sm ${q.boarded ? 'btn-outline-secondary' : 'btn-success'}`} onClick={() => handleToggleBoarded(q)}>{q.boarded ? 'Undo' : 'Mark Boarded'}</button></td></tr>))}
            {queue.length === 0 && <tr><td colSpan={5} className="text-muted">No passengers booked on this flight yet.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}
