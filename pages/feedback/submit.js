import { useState } from 'react';
const CATEGORIES = ['Complaint', 'Compliment', 'Suggestion'];
export default function SubmitFeedbackPage() {
  const [form, setForm] = useState({ name: '', email: '', booking_id: '', category: 'Complaint', message: '' });
  const [message, setMessage] = useState(''); const [messageType, setMessageType] = useState('info');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) { setMessageType('success'); setMessage('Thank you — your feedback has been submitted.'); setForm({ name: '', email: '', booking_id: '', category: 'Complaint', message: '' }); }
    else { setMessageType('danger'); setMessage(data.error); }
  };
  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h1>Feedback &amp; Complaints</h1>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3"><label className="form-label">Your Name</label><input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="mb-3"><label className="form-label">Email</label><input className="form-control" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="mb-3"><label className="form-label">Booking ID (optional)</label><input className="form-control" value={form.booking_id} onChange={(e) => setForm({ ...form, booking_id: e.target.value })} /></div>
        <div className="mb-3"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}</select></div>
        <div className="mb-3"><label className="form-label">Message</label><textarea className="form-control" rows={4} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
        <button className="btn btn-primary w-100" type="submit">Submit</button>
      </form>
    </div>
  );
}
