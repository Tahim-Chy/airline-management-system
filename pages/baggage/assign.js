import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AssignBaggagePage() {
  const [bags, setBags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assigningId, setAssigningId] = useState(null);

  async function loadUnassigned() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/baggage/assign');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not load baggage.');
      } else {
        setBags(data);
      }
    } catch (err) {
      setError('Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUnassigned();
  }, []);

  async function handleAssign(id) {
    setAssigningId(id);
    setError('');
    try {
      const res = await fetch('/api/baggage/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not assign a tag.');
      } else {
        // Bag now has a tag, so drop it from the "waiting" list.
        setBags((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      setError('Could not reach the server.');
    } finally {
      setAssigningId(null);
    }
  }

  return (
    <div className="container mt-4">
      <nav className="mb-3">
        <Link href="/baggage/register">Register baggage</Link> ·{' '}
        <Link href="/baggage/track">Track baggage status</Link>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Assign Baggage ID</h1>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadUnassigned}>
          Refresh
        </button>
      </div>
      <p className="text-muted">Bags registered at check-in that still need a tag ID.</p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : bags.length === 0 ? (
        <p className="text-muted">No baggage waiting for a tag right now.</p>
      ) : (
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Booking Ref</th>
              <th>Passenger</th>
              <th>Flight</th>
              <th>Weight (kg)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bags.map((b) => (
              <tr key={b.id}>
                <td>{b.booking_reference}</td>
                <td>{b.passenger_name}</td>
                <td>{b.flight_number}</td>
                <td>{b.weight_kg}</td>
                <td className="text-end">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAssign(b.id)}
                    disabled={assigningId === b.id}
                  >
                    {assigningId === b.id ? 'Assigning…' : 'Assign tag ID'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
