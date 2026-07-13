import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" href="/">
        AMS
      </Link>
      <div className="navbar-nav">
        <Link className="nav-link" href="/book">
          Book a Flight
        </Link>
        <Link className="nav-link" href="/baggage/register">
          Register Baggage
        </Link>
        <Link className="nav-link" href="/baggage/track">
          Track Baggage
        </Link>
        <Link className="nav-link" href="/admin/flights">
          Admin (Flights)
        </Link>
        <Link className="nav-link" href="/crew/dashboard">
          Crew Dashboard
        </Link>
        <Link className="nav-link" href="/login">
          Login
        </Link>
        <Link className="nav-link" href="/register">
          Register
        </Link>
      </div>
    </nav>
  );
}
