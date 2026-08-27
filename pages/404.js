import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center text-center fade-in" style={{ minHeight: '70vh' }}>
      <Head>
        <title>Page Not Found — BRAC Airline Booking Service</title>
      </Head>
      <i className="bi bi-signpost-split text-gold" style={{ fontSize: '4rem' }} />
      <h1 className="display-5 fw-bold mt-3">Lost in the clouds</h1>
      <p className="text-muted mb-4" style={{ maxWidth: '420px' }}>
        We could not find the page you are looking for. It may have been moved, or the address might be off.
      </p>
      <Link href="/" className="btn btn-primary px-4">
        <i className="bi bi-house-door me-2" /> Back to Home
      </Link>
    </div>
  );
}
