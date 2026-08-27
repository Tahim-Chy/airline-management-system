import { useEffect, useState } from 'react';
const STATUS_BADGE = { Scheduled: 'bg-secondary', Boarding: 'bg-primary', Delayed: 'bg-warning text-dark', Departed: 'bg-info text-dark', Landed: 'bg-success', Cancelled: 'bg-danger' };
export default function FlightStatusBoard() {
  const [flights, setFlights] = useState([]); const [lastUpdated, setLastUpdated] = useState(null);
  const loadFlights = () => fetch('/api/flights').then((res) => res.json()).then((data) => { setFlights(data); setLastUpdated(new Date()); });
  useEffect(() => { loadFlights(); const interval = setInterval(loadFlights, 10000); return () => clearInterval(interval); }, []);
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Flight Status</h1>
        {lastUpdated && <span className="text-muted small">Updated {lastUpdated.toLocaleTimeString()} · refreshes every 10s</span>}
      </div>
      <table className="table table-striped align-middle">
        <thead><tr><th>Flight</th><th>Route</th><th>Departure</th><th>Status</th></tr></thead>
        <tbody>
          {flights.map((f) => (<tr key={f.id}><td>{f.flight_number}</td><td>{f.origin} → {f.destination}</td><td>{new Date(f.departure_time).toLocaleString()}</td><td><span className={`badge ${STATUS_BADGE[f.status] || 'bg-secondary'}`}>{f.status}</span></td></tr>))}
          {flights.length === 0 && <tr><td colSpan={4} className="text-muted">No flights scheduled.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
