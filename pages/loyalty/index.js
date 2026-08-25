import { useState } from 'react';

const TIER_BADGE = {
  Bronze: 'bg-secondary',
  Silver: 'bg-light text-dark border',
  Gold: 'bg-warning text-dark',
  Platinum: 'bg-dark',
};

export default function LoyaltyPage() {
  const [bookingId, setBookingId] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');
  const [claimResult, setClaimResult] = useState(null);
  const [lookupResult, setLookupResult] = useState(null);
  const [error, setError] = useState('');

  const handleClaim = async (e) => {
    e.preventDefault();
    setError('');
    setClaimResult(null);
    const res = await fetch('/api/loyalty/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id: bookingId }),
    });
    const data = await res.json();
    if (res.ok) setClaimResult(data); else setError(data.error);
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    setError('');
    setLookupResult(null);
    const res = await fetch(`/api/loyalty/${encodeURIComponent(lookupEmail)}`);
    const data = await res.json();
    if (res.ok) setLookupResult(data); else setError(data.error);
  };

  return (
    <div className="container mt-4">
      <h1>Loyalty Program</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-md-6">
          <div className="border rounded p-3 h-100">
            <h5>Claim Points from a Booking</h5>
            <p className="text-muted small">Earn 10 points per $100 spent.</p>
            <form onSubmit={handleClaim}>
              <input
                className="form-control mb-2"
                placeholder="Booking ID"
                required
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
              />
              <button className="btn btn-primary w-100" type="submit">Claim Points</button>
            </form>
            {claimResult && (
              <div className="alert alert-success mt-3 mb-0">
                <p className="mb-1">+{claimResult.earned_points} points earned!</p>
                <p className="mb-1">Total: <strong>{claimResult.total_points}</strong> points</p>
                <span className={`badge ${TIER_BADGE[claimResult.tier]}`}>{claimResult.tier}</span>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="border rounded p-3 h-100">
            <h5>Check Your Membership</h5>
            <form onSubmit={handleLookup}>
              <input
                className="form-control mb-2"
                type="email"
                placeholder="Your Email"
                required
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
              />
              <button className="btn btn-outline-primary w-100" type="submit">Check Status</button>
            </form>
            {lookupResult && (
              <div className="mt-3">
                <p className="mb-1">{lookupResult.name}</p>
                <p className="mb-1">{lookupResult.points} points</p>
                <span className={`badge ${TIER_BADGE[lookupResult.tier]}`}>{lookupResult.tier}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-muted mt-4 small">
        Tiers: Bronze (0+), Silver (500+), Gold (2000+), Platinum (5000+)
      </p>
    </div>
  );
}
