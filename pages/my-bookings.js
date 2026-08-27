import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { SkeletonCard } from '../components/Skeleton';
import { useToast } from '../components/ToastProvider';

const STATUS_BADGE = {
  Scheduled: 'bg-secondary',
  Boarding: 'bg-primary',
  Delayed: 'bg-warning text-dark',
  Departed: 'bg-info text-dark',
  Landed: 'bg-success',
  Cancelled: 'bg-danger',
};

export default function MyBookingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');

  const loadBookings = (token) => {
    fetch('/api/bookings/my-bookings', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setBookings(data);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadBookings(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (bookingId) => {
    if (!confirm('Cancel this booking? Your seats will be released.')) return;
    const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message, 'success');
      loadBookings(localStorage.getItem('token'));
    } else {
      showToast(data.error, 'danger');
    }
  };

  return (
    <div className="container mt-4 fade-in">
      <Head>
        <title>My Bookings — BRAC Airline Booking Service</title>
      </Head>
      <h1>My Bookings</h1>
      <p className="text-muted">Every flight you have booked while logged in, in one place.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      {bookings === null && !error && (
        <div className="row g-3">
          <div className="col-md-6"><SkeletonCard /></div>
          <div className="col-md-6"><SkeletonCard /></div>
        </div>
      )}

      {bookings && bookings.length === 0 && (
        <div className="card p-5 text-center">
          <i className="bi bi-ticket-perforated fs-1 text-muted mb-3" />
          <h5>No bookings yet</h5>
          <p className="text-muted">Bookings you make while logged in will show up here.</p>
          <Link href="/book" className="btn btn-primary align-self-center px-4">
            <i className="bi bi-search me-2" /> Book a Flight
          </Link>
        </div>
      )}

      {bookings && bookings.length > 0 && (
        <div className="row g-3">
          {bookings.map((b) => (
            <div className="col-md-6" key={b.id}>
              <div className="card p-3 h-100">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="fw-bold fs-5">{b.flight_number}</div>
                    <div className="text-muted small">{b.origin} → {b.destination}</div>
                  </div>
                  <span className={`badge ${STATUS_BADGE[b.flight_status] || 'bg-secondary'}`}>{b.flight_status}</span>
                </div>
                <div className="small text-muted mb-1">
                  <i className="bi bi-calendar-event me-1" /> {new Date(b.departure_time).toLocaleString()}
                </div>
                <div className="small text-muted mb-1">
                  <i className="bi bi-person-vcard me-1" /> Booking ID: <strong>{b.id}</strong>
                </div>
                <div className="small text-muted mb-3">
                  <i className="bi bi-award me-1" /> Seat: {b.seat_numbers || 'Not selected'} · ${Number(b.total_price).toFixed(2)}
                  {b.booking_status === 'Cancelled' && <span className="text-danger ms-2">Cancelled</span>}
                </div>
                <div className="d-flex gap-2 flex-wrap mt-auto">
                  <Link href={`/book/seats/${b.id}`} className="btn btn-sm btn-outline-primary">
                    Seat &amp; Meal
                  </Link>
                  <Link href={`/boarding-pass/${b.id}`} className="btn btn-sm btn-dark">
                    Boarding Pass
                  </Link>
                  {b.booking_status !== 'Cancelled' && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancel(b.id)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
