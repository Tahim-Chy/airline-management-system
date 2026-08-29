import Link from 'next/link';

export default function AccessDenied() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center text-center fade-in" style={{ minHeight: '60vh' }}>
      <i className="bi bi-shield-lock text-gold" style={{ fontSize: '3.5rem' }} />
      <h2 className="mt-3">Access Denied</h2>
      <p className="text-muted mb-4" style={{ maxWidth: '420px' }}>
        Your account does not have permission to view this page. It is restricted to a different role.
      </p>
      <Link href="/" className="btn btn-primary px-4">
        <i className="bi bi-house-door me-2" /> Back to Home
      </Link>
    </div>
  );
}
