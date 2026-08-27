import { useEffect, useState } from 'react';
import { useSearchAndPaginate } from '../../lib/useSearchAndPaginate';
import { SearchBox, PaginationBar } from '../../components/TableControls';
import { SkeletonTableRows } from '../../components/Skeleton';
import { useToast } from '../../components/ToastProvider';

const emptyForm = { flight_number: '', origin: '', destination: '', departure_time: '', arrival_time: '', total_seats: 150, price: 100, status: 'Scheduled' };

function toDatetimeLocal(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminFlightsPage() {
  const { showToast } = useToast();
  const [flights, setFlights] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadFlights = () =>
    fetch('/api/flights')
      .then((res) => res.json())
      .then(setFlights)
      .catch(() => showToast('Could not load flights — check your database connection.', 'danger'));

  useEffect(() => {
    loadFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { query, setQuery, page, setPage, totalPages, totalResults, pageData } = useSearchAndPaginate(
    flights || [],
    (f) => [f.flight_number, f.origin, f.destination, f.status],
    8
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `/api/flights/${editingId}` : '/api/flights';
    const method = editingId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        showToast(editingId ? 'Flight updated!' : 'Flight created!', 'success');
        setForm(emptyForm);
        setEditingId(null);
        loadFlights();
      } else {
        showToast(data.error || 'Something went wrong.', 'danger');
      }
    } catch (error) {
      showToast('Network error — is the dev server running?', 'danger');
    }
  };

  const handleEdit = (flight) => {
    setEditingId(flight.id);
    setForm({
      flight_number: flight.flight_number,
      origin: flight.origin,
      destination: flight.destination,
      departure_time: toDatetimeLocal(flight.departure_time),
      arrival_time: toDatetimeLocal(flight.arrival_time),
      total_seats: flight.total_seats,
      price: flight.price,
      status: flight.status,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this flight?')) return;
    try {
      const res = await fetch(`/api/flights/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        showToast('Flight deleted.', 'success');
        loadFlights();
      } else {
        showToast(data.error || 'Could not delete this flight.', 'danger');
      }
    } catch (error) {
      showToast('Network error — is the dev server running?', 'danger');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="container mt-4 fade-in">
      <h1>Flight Scheduling (Admin)</h1>

      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <h5>{editingId ? 'Edit Flight' : 'Create Flight'}</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <input className="form-control" name="flight_number" placeholder="Flight Number" value={form.flight_number} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input className="form-control" name="origin" placeholder="Origin" value={form.origin} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input className="form-control" name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input className="form-control" type="number" name="total_seats" placeholder="Total Seats" value={form.total_seats} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Departure</label>
            <input className="form-control" type="datetime-local" name="departure_time" value={form.departure_time} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Arrival</label>
            <input className="form-control" type="datetime-local" name="arrival_time" value={form.arrival_time} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Price ($)</label>
            <input className="form-control" type="number" name="price" value={form.price} onChange={handleChange} />
          </div>
          {editingId && (
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                <option>Scheduled</option>
                <option>Boarding</option>
                <option>Delayed</option>
                <option>Departed</option>
                <option>Landed</option>
                <option>Cancelled</option>
              </select>
            </div>
          )}
        </div>
        <button className="btn btn-primary mt-3" type="submit">{editingId ? 'Update Flight' : 'Create Flight'}</button>
        {editingId && <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={handleCancelEdit}>Cancel</button>}
      </form>

      <SearchBox value={query} onChange={setQuery} placeholder="Search by flight number, route, or status…" />

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr><th>No.</th><th>Route</th><th>Departure</th><th>Seats</th><th>Price</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {flights === null && <SkeletonTableRows rows={5} columns={7} />}
            {flights !== null && pageData.map((f) => (
              <tr key={f.id}>
                <td>{f.flight_number}</td>
                <td>{f.origin} → {f.destination}</td>
                <td>{new Date(f.departure_time).toLocaleString()}</td>
                <td>{f.available_seats}/{f.total_seats}</td>
                <td>${f.price}</td>
                <td>{f.status}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(f)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(f.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {flights !== null && flights.length === 0 && (
              <tr><td colSpan={7} className="text-muted">No flights yet — create one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <PaginationBar page={page} totalPages={totalPages} totalResults={totalResults} onPageChange={setPage} />
    </div>
  );
}
