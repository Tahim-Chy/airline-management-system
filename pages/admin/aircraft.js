import { useEffect, useState } from 'react';
const STATUS_BADGE = { Available: 'bg-success', Assigned: 'bg-warning text-dark', 'In Maintenance': 'bg-danger' };
export default function AdminAircraftPage() {
  const [aircraft, setAircraft] = useState([]);
  const [form, setForm] = useState({ tail_number: '', model: '', capacity: 150 });
  const [message, setMessage] = useState(''); const [messageType, setMessageType] = useState('info');
  const loadAircraft = () => fetch('/api/aircraft').then((res) => res.json()).then(setAircraft);
  useEffect(() => { loadAircraft(); }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/aircraft', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMessageType('success'); setMessage('Aircraft added to the fleet.'); setForm({ tail_number: '', model: '', capacity: 150 }); loadAircraft(); }
    else { setMessageType('danger'); setMessage(data.error); }
  };
  const handleDelete = async (id) => { if (!confirm('Remove this aircraft from the fleet?')) return; await fetch(`/api/aircraft/${id}`, { method: 'DELETE' }); loadAircraft(); };
  return (
    <div className="container mt-4">
      <h1>Aircraft Fleet</h1>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <h5>Add Aircraft</h5>
        <div className="row g-2">
          <div className="col-md-4"><input className="form-control" placeholder="Tail Number (e.g. N12345)" required value={form.tail_number} onChange={(e) => setForm({ ...form, tail_number: e.target.value })} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Model (e.g. Boeing 737)" required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
          <div className="col-md-4"><input className="form-control" type="number" placeholder="Seat Capacity" required value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
        </div>
        <button className="btn btn-primary mt-3" type="submit">Add Aircraft</button>
      </form>
      <div className="table-responsive">
<table className="table table-striped align-middle">
        <thead><tr><th>Tail Number</th><th>Model</th><th>Capacity</th><th>Status</th><th></th></tr></thead>
        <tbody>{aircraft.map((a) => (<tr key={a.id}><td>{a.tail_number}</td><td>{a.model}</td><td>{a.capacity}</td><td><span className={`badge ${STATUS_BADGE[a.status] || 'bg-secondary'}`}>{a.status}</span></td><td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}>Remove</button></td></tr>))}</tbody>
      </table>
</div>
    </div>
  );
}
