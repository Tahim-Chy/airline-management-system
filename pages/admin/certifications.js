import { useEffect, useState } from 'react';
import { useSearchAndPaginate } from '../../lib/useSearchAndPaginate';
import { SearchBox, PaginationBar } from '../../components/TableControls';
import { SkeletonTableRows } from '../../components/Skeleton';
import { useToast } from '../../components/ToastProvider';

const STATUS_BADGE = { Valid: 'bg-success', 'Expiring Soon': 'bg-warning text-dark', Expired: 'bg-danger' };

export default function AdminCertificationsPage() {
  const { showToast } = useToast();
  const [certifications, setCertifications] = useState(null);
  const [crew, setCrew] = useState([]);
  const [form, setForm] = useState({ crew_id: '', certification_name: '', issue_date: '', expiry_date: '' });

  const loadData = () =>
    fetch('/api/certifications')
      .then((res) => res.json())
      .then((data) => {
        setCertifications(data.certifications);
        setCrew(data.crew);
      });
  useEffect(() => { loadData(); }, []);

  const { query, setQuery, page, setPage, totalPages, totalResults, pageData } = useSearchAndPaginate(
    certifications || [],
    (c) => [c.crew_name, c.certification_name, c.cert_status],
    8
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/certifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (res.ok) {
      showToast('Certification added.', 'success');
      setForm({ crew_id: '', certification_name: '', issue_date: '', expiry_date: '' });
      loadData();
    } else {
      showToast(data.error, 'danger');
    }
  };

  return (
    <div className="container mt-4 fade-in">
      <h1>Crew Certification Monitoring</h1>
      {crew.length === 0 && <div className="alert alert-warning">No crew accounts exist yet — register with the &quot;Crew&quot; role first.</div>}

      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <h5>Add Certification</h5>
        <div className="row g-2">
          <div className="col-md-3">
            <select className="form-select" value={form.crew_id} onChange={(e) => setForm({ ...form, crew_id: e.target.value })} required>
              <option value="">Crew Member</option>
              {crew.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Certification Name" required value={form.certification_name} onChange={(e) => setForm({ ...form, certification_name: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Issue Date</label>
            <input className="form-control" type="date" required value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Expiry Date</label>
            <input className="form-control" type="date" required value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
          </div>
        </div>
        <button className="btn btn-primary mt-3" type="submit">Add</button>
      </form>

      <SearchBox value={query} onChange={setQuery} placeholder="Search by crew member, certification, or status…" />
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Crew Member</th><th>Certification</th><th>Issued</th><th>Expires</th><th>Status</th></tr></thead>
          <tbody>
            {certifications === null && <SkeletonTableRows rows={5} columns={5} />}
            {certifications !== null && pageData.map((c) => (
              <tr key={c.id}>
                <td>{c.crew_name}</td>
                <td>{c.certification_name}</td>
                <td>{c.issue_date}</td>
                <td>{c.expiry_date}</td>
                <td><span className={`badge ${STATUS_BADGE[c.cert_status]}`}>{c.cert_status}</span></td>
              </tr>
            ))}
            {certifications !== null && certifications.length === 0 && (<tr><td colSpan={5} className="text-muted">No certifications recorded yet.</td></tr>)}
          </tbody>
        </table>
      </div>
      <PaginationBar page={page} totalPages={totalPages} totalResults={totalResults} onPageChange={setPage} />
    </div>
  );
}
