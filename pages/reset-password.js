import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessageType('danger');
      setMessage('Passwords do not match');
      return;
    }
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessageType('success');
      setMessage(data.message);
      setDone(true);
    } else {
      setMessageType('danger');
      setMessage(data.error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center fade-in" style={{ minHeight: '70vh', padding: '2rem 1rem' }}>
      <Head>
        <title>Reset Password — BRAC Airline Booking Service</title>
      </Head>
      <div className="card p-4 p-md-5" style={{ maxWidth: '440px', width: '100%' }}>
        <i className="bi bi-shield-lock fs-2 text-gold mb-3" />
        <h3 className="mb-1">Reset Password</h3>
        <p className="text-muted small mb-4">Choose a new password for your account.</p>
        {message && <div className={`alert alert-${messageType} py-2`}>{message}</div>}

        {!done && (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">New Password</label>
              <input
                className="form-control"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-semibold">Confirm Password</label>
              <input
                className="form-control"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100" type="submit" disabled={!token}>
              Reset Password
            </button>
            {!token && <p className="text-danger small mt-2 mb-0">No reset token found in the URL.</p>}
          </form>
        )}

        {done && (
          <Link href="/login" className="btn btn-primary w-100">Go to Login</Link>
        )}
      </div>
    </div>
  );
}
