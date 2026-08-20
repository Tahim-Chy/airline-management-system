import { useState } from 'react';

export default function RegisterBaggagePage() {
  const [form, setForm] = useState({ booking_id: '', weight_kg: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    const res = await fetch('/api/baggage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setResult(data);
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Register Baggage</h1>
      <p className="text-muted">First bag free up to 23kg. $15/kg over the limit. Each extra bag after the first adds a $50 handling fee.</p>
      <form onSubmit={handleSubmit} className="row g-2">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Booking ID"
            required
            value={form.booking_id}
            onChange={(e) => setForm({ ...form, booking_id: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <input
            className="form-control"
            type="number"
            step="0.1"
            placeholder="Weight (kg)"
            required
            value={form.weight_kg}
            onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" type="submit">
            Register Baggage
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {result && (
        <div className="alert alert-success mt-3">
          <p className="mb-1">
            Baggage registered! Your tag: <strong>{result.baggage_tag}</strong> (bag #{result.bag_number})
          </p>
          <p className="mb-0">
            Extra fee:{' '}
            <strong>{result.extra_fee > 0 ? `$${result.extra_fee.toFixed(2)}` : 'None — within free allowance'}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
