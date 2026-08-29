import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useRequireRole } from '../../lib/useRequireRole';
import { authFetch } from '../../lib/authFetch';
import AccessDenied from '../../components/AccessDenied';
export default function AnalyticsDashboard() {
  const status = useRequireRole(['admin']);
  const [data, setData] = useState(null);
  const monthlyCanvasRef = useRef(null); const flightCanvasRef = useRef(null);
  const monthlyChartRef = useRef(null); const flightChartRef = useRef(null);
  useEffect(() => {
    if (status !== 'authorized') return;
    authFetch('/api/analytics/dashboard').then((res) => (res.ok ? res.json() : { total_revenue: 0, total_expenses: 0, net_profit: 0, booking_count: 0, monthly: [], revenue_by_flight: [] })).then(setData);
  }, [status]);
  useEffect(() => {
    if (!data) return;
    if (monthlyChartRef.current) monthlyChartRef.current.destroy();
    monthlyChartRef.current = new Chart(monthlyCanvasRef.current, {
      type: 'bar',
      data: { labels: data.monthly.map((m) => m.month), datasets: [{ label: 'Revenue', data: data.monthly.map((m) => m.revenue), backgroundColor: '#0b1f3a' }, { label: 'Expenses', data: data.monthly.map((m) => m.expenses), backgroundColor: '#c9974c' }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } },
    });
    if (flightChartRef.current) flightChartRef.current.destroy();
    flightChartRef.current = new Chart(flightCanvasRef.current, {
      type: 'bar',
      data: { labels: data.revenue_by_flight.map((f) => f.flight_number), datasets: [{ label: 'Revenue by Flight', data: data.revenue_by_flight.map((f) => f.revenue), backgroundColor: '#163a63' }] },
      options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } } },
    });
    return () => { monthlyChartRef.current?.destroy(); flightChartRef.current?.destroy(); };
  }, [data]);
  if (status === 'checking' || status === 'guest') return null;
  if (status === 'unauthorized') return <AccessDenied />;
  if (!data) return (<div className="container mt-4"><h1>Revenue &amp; Expense Analytics</h1><p>Loading…</p></div>);

  return (
    <div className="container mt-4">
      <h1>Revenue &amp; Expense Analytics</h1>
      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="card p-3 text-center"><span className="text-muted small">Total Revenue</span><h3 style={{color:'#0b1f3a'}}>${data.total_revenue.toFixed(2)}</h3></div></div>
        <div className="col-md-3"><div className="card p-3 text-center"><span className="text-muted small">Total Expenses</span><h3 className="text-gold">${data.total_expenses.toFixed(2)}</h3></div></div>
        <div className="col-md-3"><div className="card p-3 text-center"><span className="text-muted small">Net Profit</span><h3 className={data.net_profit >= 0 ? 'text-success' : 'text-danger'}>${data.net_profit.toFixed(2)}</h3></div></div>
        <div className="col-md-3"><div className="card p-3 text-center"><span className="text-muted small">Confirmed Bookings</span><h3>{data.booking_count}</h3></div></div>
      </div>
      <div className="row g-4">
        <div className="col-md-7"><h5>Revenue vs Expenses by Month</h5><canvas ref={monthlyCanvasRef} /></div>
        <div className="col-md-5"><h5>Top Flights by Revenue</h5><canvas ref={flightCanvasRef} /></div>
      </div>
    </div>
  );
}
