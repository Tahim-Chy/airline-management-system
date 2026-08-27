import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role === 'crew') router.push('/crew/dashboard');
      else if (data.user.role === 'admin') router.push('/admin/dashboard');
      else router.push('/book');
    } else {
      setError(data.error);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center fade-in"
      style={{ minHeight: '80vh', padding: '2rem 1rem' }}
    >
      <Head>
        <title>Login — BRAC Airline Booking Service</title>
      </Head>
      <div className="card shadow-lg overflow-hidden" style={{ maxWidth: '820px', width: '100%' }}>
        <div className="row g-0">
          <div
            className="col-md-5 d-none d-md-flex flex-column justify-content-center p-5 text-white"
            style={{ background: 'radial-gradient(circle at top left, #163a63, #0b1f3a)' }}
          >
            <i className="bi bi-airplane-fill fs-1 text-gold mb-3" style={{ transform: 'rotate(45deg)' }} />
            <h4 className="fw-bold">Welcome back</h4>
            <p className="text-white-50 small mb-0">
              Log in to manage your bookings, check in for flights, and track your loyalty points.
            </p>
          </div>
          <div className="col-md-7 p-4 p-md-5">
            <h3 className="mb-1">Login</h3>
            <p className="text-muted small mb-4">Enter your credentials to continue.</p>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><i className="bi bi-envelope" /></span>
                  <input
                    className="form-control"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-white"><i className="bi bi-lock" /></span>
                  <input
                    className="form-control"
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
              </div>
              <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                {loading ? 'Logging in…' : 'Log In'}
              </button>
            </form>
            <p className="mt-3 mb-0 small text-center">
              No account? <Link href="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
