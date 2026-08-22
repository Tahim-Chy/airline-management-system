import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" href="/">
        AMS
      </Link>
      <div className="navbar-nav flex-row flex-wrap gap-1 align-items-center">
        <Link className="nav-link" href="/book">
          Book a Flight
        </Link>
        <Link className="nav-link" href="/baggage/register">
          Register Baggage
        </Link>
        <Link className="nav-link" href="/baggage/track">
          Track Baggage
        </Link>
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
              style={{ top: '110%', left: 0, minWidth: '220px', zIndex: 1000 }}
              onMouseLeave={() => setAdminOpen(false)}
            >
              <Link className="dropdown-item d-block p-1" href="/admin/flights">
                Flights (CRUD)
              </Link>
              <Link className="dropdown-item d-block p-1" href="/admin/aircraft">
                Aircraft Fleet
              </Link>
              <Link className="dropdown-item d-block p-1" href="/admin/gates">
                Gates
              </Link>
              <Link className="dropdown-item d-block p-1" href="/admin/assignments">
                Aircraft &amp; Gate Assignment
              </Link>
              <Link className="dropdown-item d-block p-1" href="/admin/boarding-queue">
                Boarding Queue
              </Link>
              <Link className="dropdown-item d-block p-1" href="/admin/crew-schedule">
                Crew Scheduling
              </Link>
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
