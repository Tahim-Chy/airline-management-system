import { useState } from 'react';
const TIER_BADGE = { Bronze: 'bg-secondary', Silver: 'bg-light text-dark border', Gold: 'bg-warning text-dark', Platinum: 'bg-dark' };
export default function LoyaltyPage() {
  const [bookingId, setBookingId] = useState(''); const [email, setEmail] = useState(''); const [result, setResult] = useState(null);
  const [message, setMessage] = useState(''); const [messageType, setMessageType] = useState('info');
  const handleClaim = async (e) => {
    e.preventDefault(); setMessage('');
    const res = await fetch('/api/loyalty/claim', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ booking_id: bookingId }) });
    const data = await res.json();
    if (res.ok) { setResult({ email: data.email, points: data.total_points, tier: data.tier }); setMessageType('success'); setMessage(data.message); }
    else { setMessageType('danger'); setMessage(data.error); }
  };
  const handleLookup = async (e) => {
    e.preventDefault(); setMessage('');
    const res = await fetch(`/api/loyalty/${encodeURIComponent(email)}`);
    const data = await res.json();
    if (res.ok) setResult(data); else { setMessageType('danger'); setMessage(data.error); }
  };
  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h1>Loyalty Program</h1>
      <p className="text-muted">Earn 10 points per $100 spent. Bronze → Silver (500) → Gold (2,000) → Platinum (5,000).</p>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      <form onSubmit={handleClaim} className="card p-3 mb-3">
        <h5>Claim Points From a Booking</h5>
        <div className="input-group"><input className="form-control" placeholder="Booking ID" required value={bookingId} onChange={(e) => setBookingId(e.target.value)} /><button className="btn btn-primary" type="submit">Claim</button></div>
      </form>
      <form onSubmit={handleLookup} className="card p-3 mb-4">
        <h5>Check My Points</h5>
        <div className="input-group"><input className="form-control" type="email" placeholder="Your Email" required value={email} onChange={(e) => setEmail(e.target.value)} /><button className="btn btn-outline-primary" type="submit">Look Up</button></div>
      </form>
      {result && (<div className="card p-3 text-center"><p className="text-muted mb-1">{result.email}</p><h2>{result.points} points</h2><span className={`badge ${TIER_BADGE[result.tier]} align-self-center`} style={{ fontSize: '1rem' }}>{result.tier} Member</span></div>)}
    </div>
  );
}
