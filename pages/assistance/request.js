import { useState } from 'react';

const TYPES = ['Wheelchair', 'Medical Support', 'Visual Impairment', 'Hearing Impairment', 'Other'];

export default function AssistanceRequestPage() {
  const [form, setForm] = useState({ booking_id: '', request_type: 'Wheelchair', notes: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/assistance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMessageType('success');
      setMessage('Your request has been submitted. Our ground staff will follow up before your flight.');
      setForm({ booking_id: '', request_type: 'Wheelchair', notes: '' });
    } else {
      setMessageType('danger');
      setMessage(data.error);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h1>Request Special Assistance</h1>
      <p className="text-muted">Let us know how we can support you during your journey.</p>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Booking ID</label>
          <input
            className="form-control"
            required
            value={form.booking_id}
            onChange={(e) => setForm({ ...form, booking_id: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Type of Assistance</label>
          <select
            className="form-select"
            value={form.request_type}
            onChange={(e) => setForm({ ...form, request_type: e.target.value })}
          >
            {TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Additional Notes (optional)</label>
          <textarea
            className="form-control"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">Submit Request</button>
      </form>
    </div>
  );
}
