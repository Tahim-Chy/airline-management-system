import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const MEALS = ['No Preference', 'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Halal', 'Kosher'];
const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'];

function buildSeatLabels(totalSeats) {
  const labels = [];
  const rows = Math.ceil(totalSeats / COLUMNS.length);
  for (let row = 1; row <= rows; row++) {
    for (const col of COLUMNS) {
      if (labels.length < totalSeats) labels.push(`${row}${col}`);
    }
  }
  return labels;
}

export default function SeatSelectionPage() {
  const router = useRouter();
  const { bookingId } = router.query;
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [meal, setMeal] = useState('No Preference');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/bookings/seats/${bookingId}`)
      .then((res) => res.json())
      .then((info) => {
        if (info.error) { setMessageType('danger'); setMessage(info.error); return; }
        setData(info);
        setSelected(info.current_selection || []);
        setMeal(info.current_meal || 'No Preference');
      });
  }, [bookingId]);

  const toggleSeat = (label) => {
    if (!data || data.taken_seats.includes(label)) return;
    setSaved(false);
    setSelected((prev) => {
      if (prev.includes(label)) return prev.filter((s) => s !== label);
      if (prev.length >= data.seats_needed) return prev;
      return [...prev, label];
    });
  };

  const handleSave = async () => {
    const res = await fetch(`/api/bookings/seats/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seats: selected, meal_preference: meal }),
    });
    const result = await res.json();
    if (res.ok) { setMessageType('success'); setMessage('Seats and meal preference saved!'); setSaved(true); }
    else { setMessageType('danger'); setMessage(result.error); }
  };

  if (!data) {
    return (
      <div className="container mt-4">
        <h1>Select Your Seat</h1>
        {message && <div className={`alert alert-${messageType}`}>{message}</div>}
        {!message && <p>Loading…</p>}
      </div>
    );
  }

  const seatLabels = buildSeatLabels(data.total_seats);

  return (
    <div className="container mt-4">
      <h1>Select Your Seat</h1>
      <p className="text-muted">{data.flight_number} · {data.passenger_name} · choose {data.seats_needed} seat{data.seats_needed > 1 ? 's' : ''}</p>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}
      <div className="d-flex gap-4 flex-wrap">
        <div>
          <div className="mb-3 d-flex gap-3 small">
            <span><span className="seat-legend seat-available" /> Available</span>
            <span><span className="seat-legend seat-selected" /> Selected</span>
            <span><span className="seat-legend seat-taken" /> Taken</span>
          </div>
          <div className="seat-cabin">
            {seatLabels.map((label) => {
              const isTaken = data.taken_seats.includes(label);
              const isSelected = selected.includes(label);
              const col = label.slice(-1);
              return (
                <button key={label} type="button" onClick={() => toggleSeat(label)} disabled={isTaken}
                  className={`seat-btn ${isTaken ? 'seat-taken' : isSelected ? 'seat-selected' : 'seat-available'}`}
                  style={col === 'D' ? { marginLeft: '18px' } : undefined} title={label}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ minWidth: '260px' }}>
          <h5>Meal Preference</h5>
          <select className="form-select mb-3" value={meal} onChange={(e) => setMeal(e.target.value)}>
            {MEALS.map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
          <p>Selected: <strong>{selected.length ? selected.join(', ') : 'none yet'}</strong> ({selected.length}/{data.seats_needed})</p>
          <button className="btn btn-primary w-100" disabled={selected.length !== data.seats_needed} onClick={handleSave}>Save Selection</button>
          {saved && <p className="text-success mt-2 mb-0">✓ Saved</p>}
        </div>
      </div>
      <style jsx>{`
        .seat-cabin { display: grid; grid-template-columns: repeat(6, 42px); gap: 8px; }
        .seat-btn { width: 42px; height: 42px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; border: 2px solid transparent; cursor: pointer; }
        .seat-available { background: #eef2f7; border-color: #c7d2e0; color: #33475b; }
        .seat-available:hover { border-color: #0d6efd; }
        .seat-selected { background: #0d6efd; border-color: #0d6efd; color: #fff; }
        .seat-taken { background: #e2e2e2; color: #9a9a9a; cursor: not-allowed; }
        .seat-legend { display: inline-block; width: 14px; height: 14px; border-radius: 4px; margin-right: 4px; vertical-align: middle; }
        span .seat-legend.seat-available { background: #eef2f7; border: 2px solid #c7d2e0; }
        span .seat-legend.seat-selected { background: #0d6efd; }
        span .seat-legend.seat-taken { background: #e2e2e2; }
      `}</style>
    </div>
  );
}
