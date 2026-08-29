import { useEffect, useState } from 'react';
import { useRequireRole } from '../../lib/useRequireRole';
import { authFetch } from '../../lib/authFetch';
import AccessDenied from '../../components/AccessDenied';
const STATUS_BADGE = { Available: 'bg-success', Occupied: 'bg-warning text-dark' };
export default function AdminGatesPage() {
  const status = useRequireRole(['admin']);
  const [gates, setGates] = useState([]);
  const [form, setForm] = useState({ gate_number: '', terminal: '' });
  const [message, setMessage] = useState(''); const [messageType, setMessageType] = useState('info');
  const loadGates = () => authFetch('/api/gates').then((res) => res.json()).then(setGates);
  useEffect(() => { loadGates(); }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await authFetch('/api/gates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMessageType('success'); setMessage('Gate added.'); setForm({ gate_number: '', terminal: '' }); loadGates(); }
    else { setMessageType('danger'); setMessage(data.error); }
  };
  const handleDelete = async (id) => { if (!confirm('Remove this gate?')) return; await authFetch(`/api/gates/${id}`, { method: 'DELETE' }); loadGates(); };
  if (status === 'checking' || status === 'guest') return null;
  if (status === 'unauthorized') return <AccessDenied />;

  return (
    <div className="container mt-4">
      <h1>Airport Gates</h1>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <h5>Add Gate</h5>
        <div className="row g-2">
          <div className="col-md-5"><input className="form-control" placeholder="Gate Number (e.g. A1)" required value={form.gate_number} onChange={(e) => setForm({ ...form, gate_number: e.target.value })} /></div>
          <div className="col-md-5"><input className="form-control" placeholder="Terminal (e.g. Terminal 1)" required value={form.terminal} onChange={(e) => setForm({ ...form, terminal: e.target.value })} /></div>
          <div className="col-md-2"><button className="btn btn-primary w-100" type="submit">Add</button></div>
        </div>
      </form>
      <div className="table-responsive">
<table className="table table-striped align-middle">
        <thead><tr><th>Gate</th><th>Terminal</th><th>Status</th><th></th></tr></thead>
        <tbody>{gates.map((g) => (<tr key={g.id}><td>{g.gate_number}</td><td>{g.terminal}</td><td><span className={`badge ${STATUS_BADGE[g.status] || 'bg-secondary'}`}>{g.status}</span></td><td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(g.id)}>Remove</button></td></tr>))}</tbody>
      </table>
</div>
    </div>
  );
}
