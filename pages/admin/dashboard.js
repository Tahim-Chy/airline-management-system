import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRequireRole } from '../../lib/useRequireRole';
import AccessDenied from '../../components/AccessDenied';
import { authFetch } from '../../lib/authFetch';

const QUICK_ACTIONS = [
  { href: '/admin/flights', icon: 'bi-calendar-plus', label: 'Create Flight' },
  { href: '/admin/assignments', icon: 'bi-diagram-3', label: 'Assign Aircraft & Gate' },
  { href: '/admin/boarding-queue', icon: 'bi-people', label: 'Boarding Queue' },
  { href: '/admin/crew-schedule', icon: 'bi-person-badge', label: 'Crew Scheduling' },
  { href: '/admin/maintenance', icon: 'bi-tools', label: 'Aircraft Maintenance' },
  { href: '/admin/analytics', icon: 'bi-graph-up', label: 'Revenue Analytics' },
];

export default function AdminDashboard() {
  const status = useRequireRole(['admin']);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (status !== 'authorized') return;
    authFetch('/api/admin/dashboard-stats')
      .then((res) => res.json())
      .then(setStats);
  }, [status]);

  if (status === 'checking' || status === 'guest') return null;
  if (status === 'unauthorized') return <AccessDenied />;

  const alertCount = stats ? stats.alerts.expiring_certifications + stats.alerts.active_maintenance + stats.alerts.open_fault_reports : 0;

  return (
    <div className="container mt-4 fade-in">
      <Head>
        <title>Admin Dashboard — BRAC Airline Booking Service</title>
      </Head>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="mb-0">Admin Dashboard</h1>
          <p className="text-muted mb-0">Operational overview for BRAC Airline Booking Service</p>
        </div>
      </div>

      {!stats && <p>Loading dashboard…</p>}

      {stats && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="card p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(11,31,58,0.08)' }}>
                    <i className="bi bi-airplane fs-4" style={{ color: '#0b1f3a' }} />
                  </div>
                  <div>
                    <div className="text-muted small">Total Flights</div>
                    <div className="fs-4 fw-bold">{stats.total_flights}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(11,31,58,0.08)' }}>
                    <i className="bi bi-calendar-event fs-4" style={{ color: '#0b1f3a' }} />
                  </div>
                  <div>
                    <div className="text-muted small">Departing Today</div>
                    <div className="fs-4 fw-bold">{stats.today_flights}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(201,151,76,0.15)' }}>
                    <i className="bi bi-ticket-perforated fs-4 text-gold" />
                  </div>
                  <div>
                    <div className="text-muted small">Bookings Today</div>
                    <div className="fs-4 fw-bold">{stats.today_bookings}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(25,135,84,0.12)' }}>
                    <i className="bi bi-cash-coin fs-4 text-success" />
                  </div>
                  <div>
                    <div className="text-muted small">Total Revenue</div>
                    <div className="fs-4 fw-bold">${stats.total_revenue.toFixed(0)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {alertCount > 0 && (
            <div className="card p-3 mb-4 border-0" style={{ background: '#fff8ec', borderLeft: '4px solid #c9974c' }}>
              <h6 className="mb-2">
                <i className="bi bi-exclamation-triangle text-gold me-2" />
                {alertCount} item{alertCount > 1 ? 's' : ''} need attention
              </h6>
              <div className="d-flex gap-4 flex-wrap small">
                {stats.alerts.expiring_certifications > 0 && (
                  <Link href="/admin/certifications" className="text-decoration-none">
                    <i className="bi bi-person-badge me-1" /> {stats.alerts.expiring_certifications} certification(s) expiring or expired
                  </Link>
                )}
                {stats.alerts.active_maintenance > 0 && (
                  <Link href="/admin/maintenance" className="text-decoration-none">
                    <i className="bi bi-tools me-1" /> {stats.alerts.active_maintenance} aircraft in maintenance
                  </Link>
                )}
                {stats.alerts.open_fault_reports > 0 && (
                  <Link href="/admin/faults" className="text-decoration-none">
                    <i className="bi bi-exclamation-octagon me-1" /> {stats.alerts.open_fault_reports} open fault report(s)
                  </Link>
                )}
              </div>
            </div>
          )}

          <h5 className="mb-3">Quick Actions</h5>
          <div className="row g-3">
            {QUICK_ACTIONS.map((a) => (
              <div className="col-sm-6 col-lg-4" key={a.href}>
                <Link href={a.href} className="card p-3 d-flex flex-row align-items-center gap-3 text-decoration-none h-100">
                  <i className={`bi ${a.icon} fs-4`} style={{ color: '#0b1f3a' }} />
                  <span className="fw-semibold" style={{ color: '#1a2233' }}>{a.label}</span>
                  <i className="bi bi-chevron-right ms-auto text-muted" />
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
