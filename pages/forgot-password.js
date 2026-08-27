import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setPreviewUrl('');
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.message || data.error);
    if (data.preview_url) setPreviewUrl(data.preview_url);
  };

  return (
    <div className="d-flex align-items-center justify-content-center fade-in" style={{ minHeight: '70vh', padding: '2rem 1rem' }}>
      <Head>
        <title>Forgot Password — BRAC Airline Booking Service</title>
      </Head>
      <div className="card p-4 p-md-5" style={{ maxWidth: '440px', width: '100%' }}>
        <i className="bi bi-key fs-2 text-gold mb-3" />
        <h3 className="mb-1">Forgot Password</h3>
        <p className="text-muted small mb-4">Enter your email and we will send you a reset link.</p>
        {message && <div className="alert alert-info py-2">{message}</div>}
        {previewUrl && (
          <a href={previewUrl} target="_blank" rel="noreferrer" className="small d-block mb-3">
            View the reset email (test inbox preview) →
          </a>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              className="form-control"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
        <p className="mt-3 mb-0 small text-center">
          <Link href="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
