import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [adminOpen, setAdminOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" href="/">
        AMS
      </Link>
      <div className="navbar-nav flex-row flex-wrap gap-1 align-items-center">
        <Link className="nav-link" href="/book">
          Book a Flight
        </Link>
        <Link className="nav-link" href="/status">
          Flight Status
        </Link>

        <div className="position-relative">
          <button
            type="button"
            className="btn btn-sm btn-outline-light"
            onClick={() => setServicesOpen((open) => !open)}
          >
            Passenger Services ▾
          </button>
          {servicesOpen && (
            <div
              className="position-absolute bg-white rounded shadow p-2"
              style={{ top: '110%', left: 0, minWidth: '220px', zIndex: 1000 }}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link className="dropdown-item d-block p-1" href="/baggage/register">Register Baggage</Link>
              <Link className="dropdown-item d-block p-1" href="/baggage/track">Track Baggage</Link>
              <Link className="dropdown-item d-block p-1" href="/lost-baggage/report">Report Lost Baggage</Link>
              <Link className="dropdown-item d-block p-1" href="/assistance/request">Special Assistance</Link>
              <Link className="dropdown-item d-block p-1" href="/loyalty">Loyalty Points</Link>
            </div>
          )}
        </div>

        <Link className="nav-link" href="/crew/dashboard">
          Crew Dashboard
        </Link>

        <div className="position-relative">
          <button
            type="button"
            className="btn btn-sm btn-outline-light"
            onClick={() => setAdminOpen((open) => !open)}
          >
            Admin ▾
          </button>
          {adminOpen && (
            <div
              className="position-absolute bg-white rounded shadow p-2"
              style={{ top: '110%', left: 0, minWidth: '240px', zIndex: 1000 }}
              onMouseLeave={() => setAdminOpen(false)}
            >
              <div className="text-muted small px-1 pt-1">Flights &amp; Fleet</div>
              <Link className="dropdown-item d-block p-1" href="/admin/flights">Flights (CRUD)</Link>
              <Link className="dropdown-item d-block p-1" href="/admin/flight-status">Update Flight Status</Link>
              <Link className="dropdown-item d-block p-1" href="/admin/fares">Dynamic Fares</Link>
              <Link className="dropdown-item d-block p-1" href="/admin/aircraft">Aircraft Fleet</Link>
              <Link className="dropdown-item d-block p-1" href="/admin/gates">Gates</Link>
              <Link className="dropdown-item d-block p-1" href="/admin/assignments">Aircraft &amp; Gate Assignment</Link>

              <div className="text-muted small px-1 pt-2">Passenger Ops</div>
              <Link className="dropdown-item d-block p-1" href="/admin/boarding-queue">Boarding Queue</Link>
              <Link className="dropdown-item d-block p-1" href="/admin/assistance-requests">Assistance Requests</Link>
              <Link className="dropdown-item d-block p-1" href="/admin/lost-baggage">Lost &amp; Found</Link>

              <div className="text-muted small px-1 pt-2">Crew &amp; Maintenance</div>
              <Link className="dropdown-item d-block p-1" href="/admin/crew-schedule">Crew Scheduling</Link>
              <Link className="dropdown-item d-block p-1" href="/admin/certifications">Crew Certifications</Link>
              <Link className="dropdown-item d-block p-1" href="/admin/maintenance">Aircraft Maintenance</Link>
            </div>
          )}
        </div>

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
