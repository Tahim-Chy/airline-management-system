import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
export default function CrewSchedulePage() {
  const router = useRouter(); const [schedule, setSchedule] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch('/api/crew-assignments/my-schedule', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()).then(setSchedule);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="container mt-4">
      <h1>My Flight Schedule</h1>
      {schedule === null && <p>Loading…</p>}
      {schedule && schedule.length === 0 && <p className="text-muted">No flights assigned to you yet.</p>}
      {schedule && schedule.length > 0 && (
        <div className="table-responsive">
<table className="table table-striped">
          <thead><tr><th>Flight</th><th>Route</th><th>Departure</th><th>Your Role</th><th>Status</th></tr></thead>
          <tbody>{schedule.map((s) => (<tr key={s.id}><td>{s.flight_number}</td><td>{s.origin} → {s.destination}</td><td>{new Date(s.departure_time).toLocaleString()}</td><td><span className="badge bg-primary">{s.role_on_flight}</span></td><td>{s.status}</td></tr>))}</tbody>
        </table>
</div>
      )}
    </div>
  );
}
