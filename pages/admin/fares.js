import { useEffect, useState } from 'react';
import { useRequireRole } from '../../lib/useRequireRole';
import { authFetch } from '../../lib/authFetch';
import AccessDenied from '../../components/AccessDenied';
export default function AdminFaresPage() {
  const status = useRequireRole(['admin']);
  const [fares, setFares] = useState([]);
  useEffect(() => { authFetch('/api/flights/fares').then((res) => res.json()).then(setFares); }, []);
  if (status === 'checking' || status === 'guest') return null;
  if (status === 'unauthorized') return <AccessDenied />;

  return (
    <div className="container mt-4">
      <h1>Dynamic Fare Management</h1>
      <p className="text-muted">Price adjusts automatically based on how full a flight is and how soon it departs.</p>
      <div className="table-responsive">
<table className="table table-striped align-middle">
        <thead><tr><th>Flight</th><th>Seats Filled</th><th>Base Price</th><th>Occupancy ×</th><th>Urgency ×</th><th>Current Price</th></tr></thead>
        <tbody>
          {fares.map((f) => (<tr key={f.id}><td>{f.flight_number} ({f.origin} → {f.destination})</td><td>{f.total_seats - f.available_seats}/{f.total_seats}</td><td>${f.base_price.toFixed(2)}</td><td>{f.occupancy_multiplier}×</td><td>{f.urgency_multiplier}×</td><td><strong className={f.dynamic_price > f.base_price ? 'text-danger' : ''}>${f.dynamic_price.toFixed(2)}</strong></td></tr>))}
          {fares.length === 0 && <tr><td colSpan={6} className="text-muted">No flights yet.</td></tr>}
        </tbody>
      </table>
</div>
    </div>
  );
}
