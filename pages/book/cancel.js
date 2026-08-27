import { useState } from 'react';
import Head from 'next/head';
import { useToast } from '../../components/ToastProvider';

export default function CancelBookingPage() {
  const { showToast } = useToast();
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [cancelled, setCancelled] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setError('');
    setBooking(null);
    setCancelled(false);
    const res = await fetch(`/api/bookings/${bookingId}`);
    const data = await res.json();
    if (res.ok) setBooking(data);
    else setError(data.error);
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this booking? Your seats will be released.')) return;
    const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setCancelled(true);
      showToast(data.message, 'success');
    } else {
      showToast(data.error, 'danger');
    }
  };

  return (
    <div className="container mt-4 fade-in" style={{ maxWidth: '520px' }}>
      <Head>
        <title>Cancel Booking — BRAC Airline Booking Service</title>
      </Head>
      <h1>Cancel a Booking</h1>
      <p className="text-muted">Enter your Booking ID to look up and cancel a reservation.</p>

      <form onSubmit={handleLookup} className="card p-3 mb-3">
        <div className="input-group">
          <input
            className="form-control"
            placeholder="Booking ID"
            required
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Look Up</button>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      {booking && !cancelled && (
        <div className="card p-3">
          <p className="mb-1"><strong>{booking.flight_number}</strong> — {booking.origin} → {booking.destination}</p>
          <p className="text-muted small mb-1">{new Date(booking.departure_time).toLocaleString()}</p>
          <p className="text-muted small mb-3">Passenger: {booking.passenger_name} · Status: {booking.booking_status}</p>
          {booking.booking_status === 'Cancelled' ? (
            <p className="text-muted mb-0">This booking is already cancelled.</p>
          ) : (
            <button className="btn btn-danger" onClick={handleCancel}>
              <i className="bi bi-x-circle me-2" /> Cancel This Booking
            </button>
          )}
        </div>
      )}

      {cancelled && (
        <div className="card p-3 border-0" style={{ background: '#f2f8f4' }}>
          <i className="bi bi-check-circle text-success fs-3 mb-2" />
          <p className="mb-0">Your booking has been cancelled and the seats released.</p>
        </div>
      )}
    </div>
  );
}
