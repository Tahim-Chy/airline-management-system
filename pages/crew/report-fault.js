import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
const SEVERITIES = ['Minor', 'Major', 'Critical'];
export default function ReportFaultPage() {
  const router = useRouter();
  const [aircraft, setAircraft] = useState([]);
  const [form, setForm] = useState({ aircraft_id: '', fault_description: '', severity: 'Minor' });
  const [message, setMessage] = useState(''); const [messageType, setMessageType] = useState('info');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch('/api/aircraft').then((res) => res.json()).then(setAircraft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/faults', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMessageType('success'); setMessage(data.message); setForm({ aircraft_id: '', fault_description: '', severity: 'Minor' }); }
    else { setMessageType('danger'); setMessage(data.error); }
  };
  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h1>Report Aircraft Fault</h1>
      <p className="text-muted">Major and Critical faults automatically ground the aircraft until repairs are marked resolved.</p>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3"><label className="form-label">Aircraft</label><select className="form-select" value={form.aircraft_id} onChange={(e) => setForm({ ...form, aircraft_id: e.target.value })} required><option value="">Select Aircraft</option>{aircraft.map((a) => (<option key={a.id} value={a.id}>{a.tail_number} — {a.model}</option>))}</select></div>
        <div className="mb-3"><label className="form-label">Fault Description</label><textarea className="form-control" rows={4} required value={form.fault_description} onChange={(e) => setForm({ ...form, fault_description: e.target.value })} /></div>
        <div className="mb-3"><label className="form-label">Severity</label><select className="form-select" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>{SEVERITIES.map((s) => (<option key={s} value={s}>{s}</option>))}</select></div>
        <button className="btn btn-danger w-100" type="submit">Submit Report</button>
      </form>
    </div>
  );
}
