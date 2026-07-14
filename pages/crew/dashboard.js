import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CrewDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');

  const loadHistory = async (token) => {
    const res = await fetch('/api/attendance/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setHistory(await res.json());
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!stored || !token) {
      router.push('/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(stored));
    loadHistory(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClockIn = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/attendance/clock-in', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    loadHistory(token);
  };

  const handleClockOut = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/attendance/clock-out', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessage(data.message ? `Clocked out. Worked ${data.workingHours} hours.` : data.error);
    loadHistory(token);
  };

  if (!user) return null;

  return (
    <div className="container mt-4">
      <h1>Crew Dashboard</h1>
      <p>
        Welcome, {user.name} ({user.role})
      </p>

      {message && <div className="alert alert-info">{message}</div>}

      <button className="btn btn-success me-2" onClick={handleClockIn}>
        Clock In
      </button>
      <button className="btn btn-danger" onClick={handleClockOut}>
        Clock Out
      </button>

      <h5 className="mt-4">Attendance History</h5>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Clock In</th>
            <th>Clock Out</th>
            <th>Hours Worked</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h.id}>
              <td>{h.attendance_date}</td>
              <td>{h.clock_in ? new Date(h.clock_in).toLocaleTimeString() : '-'}</td>
              <td>{h.clock_out ? new Date(h.clock_out).toLocaleTimeString() : '-'}</td>
              <td>{h.working_hours ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
