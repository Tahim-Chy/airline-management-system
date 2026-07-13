import { useEffect, useState } from 'react';

const emptyForm = {
  flight_number: '',
  origin: '',
  destination: '',
  departure_time: '',
  arrival_time: '',
  total_seats: 150,
  price: 100,
  status: 'Scheduled',
};

export default function AdminFlightsPage() {
  const [flights, setFlights] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadFlights = () => {
    fetch('/api/flights')
      .then((res) => res.json())
      .then((data) => setFlights(data));
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `/api/flights/${editingId}` : '/api/flights';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage(editingId ? 'Flight updated!' : 'Flight created!');
      setForm(emptyForm);
      setEditingId(null);
      loadFlights();
    } else {
      setMessage('Something went wrong.');
    }
  };

  const handleEdit = (flight) => {
    setEditingId(flight.id);
    setForm({
      flight_number: flight.flight_number,
      origin: flight.origin,
      destination: flight.destination,
      departure_time: flight.departure_time.slice(0, 16),
      arrival_time: flight.arrival_time.slice(0, 16),
      total_seats: flight.total_seats,
      price: flight.price,
      status: flight.status,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this flight?')) return;
    await fetch(`/api/flights/${id}`, { method: 'DELETE' });
    loadFlights();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="container mt-4">
      <h1>Flight Scheduling (Admin)</h1>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="border rounded p-3 mb-4">
        <h5>{editingId ? 'Edit Flight' : 'Create Flight'}</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <input
              className="form-control"
              name="flight_number"
              placeholder="Flight Number"
              value={form.flight_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              name="origin"
              placeholder="Origin"
              value={form.origin}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              name="destination"
              placeholder="Destination"
              value={form.destination}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="number"
              name="total_seats"
              placeholder="Total Seats"
              value={form.total_seats}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Departure</label>
            <input
              className="form-control"
              type="datetime-local"
              name="departure_time"
              value={form.departure_time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Arrival</label>
            <input
              className="form-control"
              type="datetime-local"
              name="arrival_time"
              value={form.arrival_time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Price ($)</label>
            <input
              className="form-control"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
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
        <button className="btn btn-primary mt-3" type="submit">
          {editingId ? 'Update Flight' : 'Create Flight'}
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>No.</th>
            <th>Route</th>
            <th>Departure</th>
            <th>Seats</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((f) => (
            <tr key={f.id}>
              <td>{f.flight_number}</td>
              <td>{f.origin} → {f.destination}</td>
              <td>{new Date(f.departure_time).toLocaleString()}</td>
              <td>{f.available_seats}/{f.total_seats}</td>
              <td>${f.price}</td>
              <td>{f.status}</td>
              <td>
                <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(f)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(f.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
