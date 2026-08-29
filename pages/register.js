import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'passenger' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) router.push('/login');
    else setError(data.error);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center fade-in"
      style={{ minHeight: '80vh', padding: '2rem 1rem' }}
    >
      <Head>
        <title>Register — BRAC Airline Booking Service</title>
      </Head>
      <div className="card shadow-lg overflow-hidden" style={{ maxWidth: '820px', width: '100%' }}>
        <div className="row g-0">
          <div
            className="col-md-5 d-none d-md-flex flex-column justify-content-center p-5 text-white"
            style={{ background: 'radial-gradient(circle at top left, #163a63, #0b1f3a)' }}
          >
            <i className="bi bi-person-plus-fill fs-1 text-gold mb-3" />
            <h4 className="fw-bold">Join BRAC Airline</h4>
            <p className="text-white-50 small mb-0">
              Create an account to save your bookings, earn loyalty points, and check in faster next time.
            </p>
          </div>
          <div className="col-md-7 p-4 p-md-5">
            <h3 className="mb-1">Register</h3>
            <p className="text-muted small mb-4">It only takes a minute.</p>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name</label>
                <input
                  className="form-control"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email</label>
                <input
                  className="form-control"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Password</label>
                <input
                  className="form-control"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold">Role</label>
                <select
                  className="form-select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="passenger">Passenger</option>
                  <option value="crew">Crew</option>
                  <option value="ground_staff">Ground Staff</option>
                </select>
                <div className="form-text">Admin accounts are not self-registered — there is a single fixed administrator account for this system.</div>
              </div>
              <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                {loading ? 'Creating account…' : 'Register'}
              </button>
            </form>
            <p className="mt-3 mb-0 small text-center">
              Already have an account? <Link href="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
