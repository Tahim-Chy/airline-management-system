import { useState } from 'react';

export default function BookFlightPage() {
  const [step, setStep] = useState('search'); // search -> results -> details -> confirmed
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
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    <div className="container mt-4">
      <h1>Book a Flight</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      {step === 'search' && (
        <form onSubmit={handleSearch} className="row g-2">
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="From"
              value={searchForm.origin}
              onChange={(e) => setSearchForm({ ...searchForm, origin: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              placeholder="To"
              value={searchForm.destination}
              onChange={(e) => setSearchForm({ ...searchForm, destination: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="date"
              value={searchForm.date}
              onChange={(e) => setSearchForm({ ...searchForm, date: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary w-100" type="submit">
              Search Flights
            </button>
          </div>
        </form>
      )}

      {step === 'results' && (
        <div className="mt-4">
          <button className="btn btn-link mb-2" onClick={() => setStep('search')}>
            ← New Search
          </button>
          {results.length === 0 && <p>No flights found.</p>}
          {results.map((f) => (
            <div key={f.id} className="card mb-2 p-3 d-flex flex-row justify-content-between align-items-center">
              <div>
                <strong>{f.flight_number}</strong> — {f.origin} → {f.destination}
                <br />
                {new Date(f.departure_time).toLocaleString()} · {f.available_seats} seats left · ${f.price}
              </div>
              <button className="btn btn-success" onClick={() => selectFlight(f)}>
                Select
              </button>
            </div>
          ))}
        </div>
      )}

      {step === 'details' && selectedFlight && (
        <form onSubmit={handleBook} className="mt-4">
          <button type="button" className="btn btn-link mb-2" onClick={() => setStep('results')}>
            ← Back to results
          </button>
          <h5>Passenger Details for {selectedFlight.flight_number}</h5>
          <div className="row g-2">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Full Name"
                required
                value={passengerForm.passenger_name}
                onChange={(e) => setPassengerForm({ ...passengerForm, passenger_name: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="email"
                placeholder="Email"
                required
                value={passengerForm.passenger_email}
                onChange={(e) => setPassengerForm({ ...passengerForm, passenger_email: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Phone"
                value={passengerForm.passenger_phone}
                onChange={(e) => setPassengerForm({ ...passengerForm, passenger_phone: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Passport Number"
                value={passengerForm.passport_number}
                onChange={(e) => setPassengerForm({ ...passengerForm, passport_number: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                type="number"
                min="1"
                max={selectedFlight.available_seats}
                value={passengerForm.seat_count}
                onChange={(e) => setPassengerForm({ ...passengerForm, seat_count: Number(e.target.value) })}
              />
            </div>
          </div>
          <button className="btn btn-primary mt-3" type="submit">
            Confirm Booking
          </button>
        </form>
      )}

      {step === 'confirmed' && confirmation && (
        <div className="alert alert-success mt-4">
          <h5>Booking Confirmed!</h5>
          <p>
            Booking ID: <strong>{confirmation.bookingId}</strong>
          </p>
          <p>
            Total Price: <strong>${confirmation.total_price}</strong>
          </p>
          <p>Use this Booking ID to check in baggage next.</p>
        </div>
      )}
    </div>
  );
}
