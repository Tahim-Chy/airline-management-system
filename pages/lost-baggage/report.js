import { useState } from 'react';

export default function ReportLostBaggagePage() {
  const [form, setForm] = useState({
    baggage_tag: '',
    passenger_name: '',
    contact_email: '',
    description: '',
    last_seen_location: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/lost-baggage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMessageType('success');
      setMessage('Your report has been filed. Our team will investigate and update you by email.');
      setForm({ baggage_tag: '', passenger_name: '', contact_email: '', description: '', last_seen_location: '' });
    } else {
      setMessageType('danger');
      setMessage(data.error);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h1>Report Lost Baggage</h1>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Baggage Tag (if known)</label>
          <input
            className="form-control"
            placeholder="BAG-123456"
            value={form.baggage_tag}
            onChange={(e) => setForm({ ...form, baggage_tag: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input
            className="form-control"
            required
            value={form.passenger_name}
            onChange={(e) => setForm({ ...form, passenger_name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Email</label>
          <input
            className="form-control"
            type="email"
            required
            value={form.contact_email}
            onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description of Baggage</label>
          <textarea
            className="form-control"
            rows={2}
            required
            placeholder="Black hardshell suitcase, red ribbon on handle..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Seen Location</label>
          <input
            className="form-control"
            placeholder="Baggage claim, Terminal 2"
            value={form.last_seen_location}
            onChange={(e) => setForm({ ...form, last_seen_location: e.target.value })}
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">Submit Report</button>
      </form>
    </div>
  );
}
