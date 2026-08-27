import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-5 py-4" style={{ background: '#0b1f3a', color: '#c7d0e2' }}>
      <div className="container">
        <div className="row gy-3">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-airplane-fill text-gold" style={{ transform: 'rotate(45deg)' }} />
              <span className="text-white fw-bold">BRAC Airline Booking Service</span>
            </div>
            <p className="small mb-0">A university software engineering project — built end to end with a real MVC architecture.</p>
          </div>
          <div className="col-md-4">
            <div className="text-white fw-semibold small mb-2">Quick Links</div>
            <div className="d-flex flex-column gap-1 small">
              <Link className="text-decoration-none" style={{ color: '#c7d0e2' }} href="/book">Book a Flight</Link>
              <Link className="text-decoration-none" style={{ color: '#c7d0e2' }} href="/status">Flight Status</Link>
              <Link className="text-decoration-none" style={{ color: '#c7d0e2' }} href="/my-bookings">My Bookings</Link>
              <Link className="text-decoration-none" style={{ color: '#c7d0e2' }} href="/feedback/submit">Feedback</Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-white fw-semibold small mb-2">Support</div>
            <div className="d-flex flex-column gap-1 small">
              <Link className="text-decoration-none" style={{ color: '#c7d0e2' }} href="/assistance/request">Special Assistance</Link>
              <Link className="text-decoration-none" style={{ color: '#c7d0e2' }} href="/lost-baggage/report">Lost &amp; Found</Link>
              <Link className="text-decoration-none" style={{ color: '#c7d0e2' }} href="/loyalty">Loyalty Program</Link>
            </div>
          </div>
        </div>
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} className="my-3" />
        <p className="small mb-0 text-center" style={{ color: '#8592ab' }}>
          © {new Date().getFullYear()} BRAC Airline Booking Service. Built for CSE470.
        </p>
      </div>
    </footer>
  );
}
