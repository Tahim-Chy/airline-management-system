import { useState } from 'react';

const STATUSES = ['Checked-In', 'Loaded', 'In Transit', 'Arrived', 'Lost'];

export default function TrackBaggagePage() {
  const [tag, setTag] = useState('');
  const [baggage, setBaggage] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setBaggage(null);
    const res = await fetch(`/api/baggage/${tag}`);
    const data = await res.json();
    if (res.ok) {
      setBaggage(data);
    } else {
      setError(data.error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    await fetch(`/api/baggage/${tag}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setBaggage({ ...baggage, status: newStatus });
  };

  return (
    <div className="container mt-4">
      <h1>Track Baggage</h1>
      <form onSubmit={handleTrack} className="row g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Enter Baggage Tag (e.g. BAG-123456)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" type="submit">
            Track
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {baggage && (
        <div className="card mt-3 p-3">
          <p>
            Tag: <strong>{baggage.baggage_tag}</strong>
          </p>
          <p>Weight: {baggage.weight_kg} kg</p>
          <p>
            Current Status: <strong>{baggage.status}</strong>
          </p>
          <label className="form-label">Update Status (admin/ground staff)</label>
          <select
            className="form-select"
            value={baggage.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
