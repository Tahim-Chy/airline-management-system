import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function BookFlightPage() {
  const [step, setStep] = useState('search');
  const [searchForm, setSearchForm] = useState({ origin: '', destination: '', date: '' });
  const [results, setResults] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerForm, setPassengerForm] = useState({
    passenger_name: '',
    passenger_email: '',
    passenger_phone: '',
    passport_number: '',
    seat_count: 1,
  });
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLoggedIn(true);
        setPassengerForm((prev) => ({ ...prev, passenger_name: user.name, passenger_email: user.email }));
      } catch (e) {
        // ignore malformed storage
      }
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    const params = new URLSearchParams(searchForm).toString();
    const res = await fetch(`/api/bookings/search?${params}`);
    const data = await res.json();
    setResults(data);
    setStep('results');
  };

  const selectFlight = (flight) => {
    setSelectedFlight(flight);
    setStep('details');
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ flight_id: selectedFlight.id, ...passengerForm }),
    });
    const data = await res.json();
    if (res.ok) {
      setConfirmation(data);
      setStep('confirmed');
    } else {
      setError(data.error || 'Booking failed');
    }
  };

  return (
    <div className="container mt-4 fade-in">
      <Head>
        <title>Book a Flight — BRAC Airline Booking Service</title>
      </Head>
      <h1>Book a Flight</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      {step === 'search' && (
        <form onSubmit={handleSearch} className="card p-4 row g-2">
          <div className="col-md-3">
            <label className="form-label small fw-semibold">From</label>
            <input className="form-control" value={searchForm.origin} onChange={(e) => setSearchForm({ ...searchForm, origin: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">To</label>
            <input className="form-control" value={searchForm.destination} onChange={(e) => setSearchForm({ ...searchForm, destination: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-semibold">Date</label>
            <input className="form-control" type="date" value={searchForm.date} onChange={(e) => setSearchForm({ ...searchForm, date: e.target.value })} />
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button className="btn btn-primary w-100" type="submit">
              <i className="bi bi-search me-2" /> Search Flights
            </button>
          </div>
        </form>
      )}

      {step === 'results' && (
        <div className="mt-4">
          <button className="btn btn-link mb-2 ps-0" onClick={() => setStep('search')}>
            <i className="bi bi-arrow-left me-1" /> New Search
          </button>
          {results.length === 0 && <p className="text-muted">No flights found.</p>}
          {results.map((f) => (
            <div key={f.id} className="card mb-2 p-3 d-flex flex-row justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <strong>{f.flight_number}</strong> — {f.origin} → {f.destination}
                <br />
                <span className="text-muted small">
                  {new Date(f.departure_time).toLocaleString()} · {f.available_seats} seats left · <strong>${f.dynamic_price ?? f.price}</strong>
                </span>
              </div>
              <button className="btn btn-primary" onClick={() => selectFlight(f)}>
                Select
              </button>
            </div>
          ))}
        </div>
      )}

      {step === 'details' && selectedFlight && (
        <form onSubmit={handleBook} className="card p-4 mt-4">
          <button type="button" className="btn btn-link mb-2 ps-0" onClick={() => setStep('results')}>
            <i className="bi bi-arrow-left me-1" /> Back to results
          </button>
          <h5>Passenger Details for {selectedFlight.flight_number}</h5>
          {loggedIn && (
            <p className="small text-muted">
              <i className="bi bi-check-circle text-success me-1" /> Prefilled from your account — this booking will also appear in My Bookings.
            </p>
          )}
          <div className="row g-2">
            <div className="col-md-6">
              <input className="form-control" placeholder="Full Name" required value={passengerForm.passenger_name} onChange={(e) => setPassengerForm({ ...passengerForm, passenger_name: e.target.value })} />
            </div>
            <div className="col-md-6">
              <input className="form-control" type="email" placeholder="Email" required value={passengerForm.passenger_email} onChange={(e) => setPassengerForm({ ...passengerForm, passenger_email: e.target.value })} />
            </div>
            <div className="col-md-6">
              <input className="form-control" placeholder="Phone" value={passengerForm.passenger_phone} onChange={(e) => setPassengerForm({ ...passengerForm, passenger_phone: e.target.value })} />
            </div>
            <div className="col-md-6">
              <input className="form-control" placeholder="Passport Number" value={passengerForm.passport_number} onChange={(e) => setPassengerForm({ ...passengerForm, passport_number: e.target.value })} />
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-semibold">Seats</label>
              <input className="form-control" type="number" min="1" max={selectedFlight.available_seats} value={passengerForm.seat_count} onChange={(e) => setPassengerForm({ ...passengerForm, seat_count: Number(e.target.value) })} />
            </div>
          </div>
          <button className="btn btn-primary mt-3" type="submit">Confirm Booking</button>
        </form>
      )}

      {step === 'confirmed' && confirmation && (
        <div className="card p-4 mt-4 border-0" style={{ background: '#f2f8f4' }}>
          <h5><i className="bi bi-check-circle text-success me-2" />Booking Confirmed!</h5>
          <p>Booking ID: <strong>{confirmation.bookingId}</strong></p>
          <p>Total Price: <strong>${confirmation.total_price}</strong></p>
          <div className="d-flex gap-2 flex-wrap">
            <Link href={`/book/seats/${confirmation.bookingId}`} className="btn btn-primary">
              Select Seat &amp; Meal →
            </Link>
            <Link href={`/boarding-pass/${confirmation.bookingId}`} className="btn btn-dark">
              Get Boarding Pass →
            </Link>
            <Link href="/assistance/request" className="btn btn-outline-primary">
              Request Special Assistance
            </Link>
            <Link href="/loyalty" className="btn btn-outline-primary">
              Claim Loyalty Points
            </Link>
            {loggedIn && (
              <Link href="/my-bookings" className="btn btn-outline-secondary">
                View My Bookings
              </Link>
            )}
          </div>
          <p className="mt-2 mb-0 text-muted small">
            Use Booking ID <strong>{confirmation.bookingId}</strong> for baggage check-in too.
          </p>
        </div>
      )}
    </div>
  );
}
