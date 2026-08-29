import Link from 'next/link';
import Head from 'next/head';
import { useRequireRole } from '../../lib/useRequireRole';
import AccessDenied from '../../components/AccessDenied';

const DUTIES = [
  { href: '/admin/boarding-queue', icon: 'bi-people', label: 'Boarding Queue', text: 'Assign boarding groups and check passengers in at the gate.' },
  { href: '/admin/assistance-requests', icon: 'bi-heart', label: 'Assistance Requests', text: 'Review and fulfil special assistance requests.' },
  { href: '/admin/lost-baggage', icon: 'bi-bag-x', label: 'Lost & Found', text: 'Track down and update the status of lost baggage reports.' },
  { href: '/baggage/track', icon: 'bi-geo-alt', label: 'Track Baggage', text: 'Look up any bag by its tag.' },
];

export default function GroundStaffDashboard() {
  const status = useRequireRole(['admin', 'ground_staff']);

  if (status === 'checking' || status === 'guest') return null;
  if (status === 'unauthorized') return <AccessDenied />;

  return (
    <div className="container mt-4 fade-in">
      <Head>
        <title>Ground Staff Dashboard — BRAC Airline Booking Service</title>
      </Head>
      <h1>Ground Staff Dashboard</h1>
      <p className="text-muted">Your operational duties — boarding, assistance, and baggage.</p>

      <div className="row g-3 mt-2">
        {DUTIES.map((d) => (
          <div className="col-sm-6 col-lg-4" key={d.href}>
            <Link href={d.href} className="card p-3 h-100 text-decoration-none">
              <i className={`bi ${d.icon} fs-3 mb-2`} style={{ color: '#0b1f3a' }} />
              <h6 style={{ color: '#1a2233' }}>{d.label}</h6>
              <p className="text-muted small mb-0">{d.text}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
