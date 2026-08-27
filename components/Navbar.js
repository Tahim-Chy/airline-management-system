import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const [adminOpen, setAdminOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(stored));
      } catch (error) {
        // ignore malformed storage
      }
    }
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-3 py-2 sticky-top"
      style={{ background: 'linear-gradient(90deg, #0b1f3a, #163a63)', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}
    >
      <Link className="navbar-brand d-flex align-items-center gap-2" href="/">
        <i className="bi bi-airplane-fill text-gold fs-4" style={{ transform: 'rotate(45deg)' }} />
        <span>
          <span className="fw-bold">BRAC Airline</span>
          <span className="d-none d-md-inline text-white-50 fw-normal"> · Booking Service</span>
        </span>
      </Link>

      <div className="navbar-nav flex-row flex-wrap gap-1 align-items-center ms-lg-3">
        <Link className="nav-link d-flex align-items-center gap-1" href="/book">
          <i className="bi bi-search" /> Book a Flight
        </Link>
        <Link className="nav-link d-flex align-items-center gap-1" href="/status">
          <i className="bi bi-broadcast" /> Flight Status
        </Link>

        <div className="position-relative">
          <button
            type="button"
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
            onClick={() => setServicesOpen((o) => !o)}
          >
            <i className="bi bi-person-heart" /> Passenger Services <i className="bi bi-caret-down-fill small" />
          </button>
          {servicesOpen && (
            <div
              className="position-absolute bg-white rounded-3 shadow-lg p-2 fade-in"
              style={{ top: '110%', left: 0, minWidth: '240px', zIndex: 1000 }}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link className="dropdown-item d-flex align-items-center gap-2 rounded-2 p-2" href="/my-bookings">
                <i className="bi bi-ticket-perforated text-navy" /> My Bookings
              </Link>
              <Link className="dropdown-item d-flex align-items-center gap-2 rounded-2 p-2" href="/baggage/register">
                <i className="bi bi-suitcase" /> Register Baggage
              </Link>
              <Link className="dropdown-item d-flex align-items-center gap-2 rounded-2 p-2" href="/baggage/track">
                <i className="bi bi-geo-alt" /> Track Baggage
              </Link>
              <Link className="dropdown-item d-flex align-items-center gap-2 rounded-2 p-2" href="/lost-baggage/report">
                <i className="bi bi-exclamation-triangle" /> Report Lost Baggage
              </Link>
              <Link className="dropdown-item d-flex align-items-center gap-2 rounded-2 p-2" href="/assistance/request">
                <i className="bi bi-heart" /> Special Assistance
              </Link>
              <Link className="dropdown-item d-flex align-items-center gap-2 rounded-2 p-2" href="/loyalty">
                <i className="bi bi-award" /> Loyalty Points
              </Link>
              <Link className="dropdown-item d-flex align-items-center gap-2 rounded-2 p-2" href="/feedback/submit">
                <i className="bi bi-chat-left-text" /> Feedback &amp; Complaints
              </Link>
            </div>
          )}
        </div>

        <Link className="nav-link d-flex align-items-center gap-1" href="/crew/dashboard">
          <i className="bi bi-person-badge" /> Crew
        </Link>

        <div className="position-relative">
          <button
            type="button"
            className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
            onClick={() => setAdminOpen((o) => !o)}
          >
            <i className="bi bi-speedometer2" /> Admin <i className="bi bi-caret-down-fill small" />
          </button>
          {adminOpen && (
            <div
              className="position-absolute bg-white rounded-3 shadow-lg p-2 fade-in"
              style={{ top: '110%', left: 0, minWidth: '260px', maxHeight: '75vh', overflowY: 'auto', zIndex: 1000 }}
              onMouseLeave={() => setAdminOpen(false)}
            >
              <Link className="dropdown-item d-flex align-items-center gap-2 rounded-2 p-2 fw-semibold" href="/admin/dashboard">
                <i className="bi bi-grid-1x2" /> Dashboard
              </Link>
              <div className="text-muted small px-2 pt-2">Flights &amp; Fleet</div>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/flights">Flights (CRUD)</Link>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/flight-status">Update Flight Status</Link>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/fares">Dynamic Fares</Link>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/aircraft">Aircraft Fleet</Link>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/gates">Gates</Link>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/assignments">Aircraft &amp; Gate Assignment</Link>

              <div className="text-muted small px-2 pt-2">Passenger Ops</div>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/boarding-queue">Boarding Queue</Link>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/assistance-requests">Assistance Requests</Link>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/lost-baggage">Lost &amp; Found</Link>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/feedback">Feedback &amp; Complaints</Link>

              <div className="text-muted small px-2 pt-2">Crew &amp; Maintenance</div>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/crew-schedule">Crew Scheduling</Link>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/certifications">Crew Certifications</Link>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/maintenance">Aircraft Maintenance</Link>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/faults">Fault Reports</Link>

              <div className="text-muted small px-2 pt-2">Finance</div>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/analytics">Revenue &amp; Expense Dashboard</Link>
              <Link className="dropdown-item d-block p-1 px-2" href="/admin/expenses">Log an Expense</Link>
            </div>
          )}
        </div>
      </div>

      <div className="ms-auto d-flex align-items-center gap-2">
        {user ? (
          <>
            <span className="text-white-50 small d-none d-sm-inline">
              <i className="bi bi-person-circle me-1" />
              {user.name} <span className="text-capitalize">({user.role})</span>
            </span>
            <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1" /> Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-sm btn-outline-light" href="/login">
              Login
            </Link>
            <Link className="btn btn-sm btn-gold" href="/register">
              Register
            </Link>
          </>
        )}
      </div>

      <style jsx>{`
        .text-navy {
          color: #0b1f3a;
        }
        .dropdown-item:hover {
          background-color: #f5f7fb;
        }
      `}</style>
    </nav>
  );
}
