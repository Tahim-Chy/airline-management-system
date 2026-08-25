import { useEffect, useState } from 'react';

const STATUS_BADGE = {
  Valid: 'bg-success',
  'Expiring Soon': 'bg-warning text-dark',
  Expired: 'bg-danger',
};

export default function AdminCertificationsPage() {
  const [crew, setCrew] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [form, setForm] = useState({ crew_id: '', certification_name: '', issue_date: '', expiry_date: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const loadAll = () => {
    fetch('/api/crew/list').then((res) => res.json()).then(setCrew);
    fetch('/api/certifications').then((res) => res.json()).then(setCertifications);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/certifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setMessageType('success');
      setMessage('Certification recorded.');
      setForm({ crew_id: '', certification_name: '', issue_date: '', expiry_date: '' });
      loadAll();
    } else {
      setMessageType('danger');
      setMessage(data.error);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Crew Certification Monitoring</h1>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      {crew.length === 0 && (
        <div className="alert alert-warning">
          No crew accounts exist yet — register a few users with the &quot;Crew&quot; role at /register first.
        </div>
      )}

      <form onSubmit={handleSubmit} className="border rounded p-3 mb-4">
        <h5>Record a Certification</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <select className="form-select" value={form.crew_id} onChange={(e) => setForm({ ...form, crew_id: e.target.value })} required>
              <option value="">Crew Member</option>
              {crew.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="e.g. Type Rating - 737"
              required
              value={form.certification_name}
              onChange={(e) => setForm({ ...form, certification_name: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Issue Date</label>
            <input className="form-control" type="date" required value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Expiry Date</label>
            <input className="form-control" type="date" required value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
          </div>
        </div>
        <button className="btn btn-primary mt-3" type="submit">Save Certification</button>
      </form>

      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Crew Member</th>
            <th>Certification</th>
            <th>Issued</th>
            <th>Expires</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {certifications.map((c) => (
            <tr key={c.id}>
              <td>{c.crew_name}</td>
              <td>{c.certification_name}</td>
              <td>{c.issue_date}</td>
              <td>{c.expiry_date}</td>
              <td><span className={`badge ${STATUS_BADGE[c.status]}`}>{c.status}</span></td>
            </tr>
          ))}
          {certifications.length === 0 && (
            <tr>
              <td colSpan={5} className="text-muted">No certifications recorded yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
