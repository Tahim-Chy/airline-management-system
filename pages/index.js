import Head from 'next/head';
import Link from 'next/link';

const FEATURES = [
  { icon: 'bi-lightning-charge', title: 'Instant Booking', text: 'Search, select seats, and confirm your flight in minutes with live dynamic pricing.' },
  { icon: 'bi-qr-code', title: 'Digital Boarding Pass', text: 'Get a QR-coded boarding pass instantly, delivered straight to your inbox.' },
  { icon: 'bi-broadcast', title: 'Real-Time Status', text: 'Live flight status updates that refresh automatically — no manual reloading.' },
  { icon: 'bi-award', title: 'Loyalty Rewards', text: 'Earn points on every booking and unlock Bronze through Platinum tier benefits.' },
  { icon: 'bi-suitcase', title: 'Baggage Tracking', text: 'Track your baggage from check-in to arrival, and report lost items in seconds.' },
  { icon: 'bi-heart', title: 'Special Assistance', text: 'Request wheelchair, medical, or accessibility support before you fly.' },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>BRAC Airline Booking Service — Book Your Next Flight</title>
      </Head>

      <section
        className="text-white"
        style={{
          background: 'radial-gradient(circle at top right, #163a63, #0b1f3a 70%)',
          padding: '5rem 0 6rem',
        }}
      >
        <div className="container fade-in">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge text-white mb-3" style={{ backgroundColor: '#c9974c' }}>
                <i className="bi bi-mortarboard me-1" /> A CSE470 Software Engineering Project
              </span>
              <h1 className="display-4 fw-bold text-white mb-3">
                Fly smarter with <span className="text-gold">BRAC Airline</span>
              </h1>
              <p className="fs-5 text-white-50 mb-4" style={{ maxWidth: '520px' }}>
                Search flights, pick your seat, track your baggage, and manage your whole
                journey from one place — built end-to-end with real MVC architecture.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link href="/book" className="btn btn-gold btn-lg px-4">
                  <i className="bi bi-search me-2" /> Book a Flight
                </Link>
                <Link href="/status" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-broadcast me-2" /> Check Flight Status
                </Link>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block text-center">
              <i className="bi bi-airplane-fill" style={{ fontSize: '13rem', color: 'rgba(201,151,76,0.25)', transform: 'rotate(45deg)' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Everything you need, in one place</h2>
          <p className="text-muted">From booking to boarding, every step of your journey is covered.</p>
        </div>
        <div className="row g-4">
          {FEATURES.map((f) => (
            <div className="col-md-6 col-lg-4" key={f.title}>
              <div className="card h-100 p-4">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{ width: '52px', height: '52px', background: 'rgba(11,31,58,0.08)' }}
                >
                  <i className={`bi ${f.icon} fs-4`} style={{ color: '#0b1f3a' }} />
                </div>
                <h5>{f.title}</h5>
                <p className="text-muted mb-0 small">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-5" style={{ background: '#eef2f9' }}>
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Ready to take off?</h3>
          <p className="text-muted mb-4">Create an account to track bookings, earn loyalty points, and check in faster.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link href="/register" className="btn btn-primary btn-lg px-4">
              <i className="bi bi-person-plus me-2" /> Create an Account
            </Link>
            <Link href="/my-bookings" className="btn btn-outline-primary btn-lg px-4">
              <i className="bi bi-ticket-perforated me-2" /> View My Bookings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
