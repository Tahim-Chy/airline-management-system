import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
const STATUS_BADGE = { Valid: 'bg-success', 'Expiring Soon': 'bg-warning text-dark', Expired: 'bg-danger' };
export default function MyCertificationsPage() {
  const router = useRouter();
  const [certs, setCerts] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch('/api/certifications/my-certifications', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()).then(setCerts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="container mt-4">
      <h1>My Certifications</h1>
      {certs === null && <p>Loading…</p>}
      {certs && certs.length === 0 && <p className="text-muted">No certifications on file yet.</p>}
      {certs && certs.length > 0 && (
        <table className="table table-striped">
          <thead><tr><th>Certification</th><th>Issued</th><th>Expires</th><th>Status</th></tr></thead>
          <tbody>{certs.map((c) => (<tr key={c.id}><td>{c.certification_name}</td><td>{c.issue_date}</td><td>{c.expiry_date}</td><td><span className={`badge ${STATUS_BADGE[c.cert_status]}`}>{c.cert_status}</span></td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
}
