import { getTotalRevenue, getRevenueByMonth, getRevenueByFlight, getBookingCount } from '../models/analyticsModel';
import { getTotalExpenses, getExpensesByMonth } from '../models/expenseModel';
import { requireRole } from '../lib/auth';

function mergeByMonth(revenueRows, expenseRows) {
  const months = new Set([...revenueRows.map((r) => r.month), ...expenseRows.map((r) => r.month)]);
  const revenueMap = Object.fromEntries(revenueRows.map((r) => [r.month, Number(r.total)]));
  const expenseMap = Object.fromEntries(expenseRows.map((r) => [r.month, Number(r.total)]));
  return [...months].sort().map((month) => ({ month, revenue: revenueMap[month] || 0, expenses: expenseMap[month] || 0 }));
}

export async function getDashboardData(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try {
    const [totalRevenue, totalExpenses, revenueByMonth, expensesByMonth, revenueByFlight, bookingCount] = await Promise.all([getTotalRevenue(), getTotalExpenses(), getRevenueByMonth(), getExpensesByMonth(), getRevenueByFlight(), getBookingCount()]);
    res.status(200).json({ total_revenue: totalRevenue, total_expenses: totalExpenses, net_profit: Number((totalRevenue - totalExpenses).toFixed(2)), booking_count: bookingCount, monthly: mergeByMonth(revenueByMonth, expensesByMonth), revenue_by_flight: revenueByFlight });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to load analytics dashboard' }); }
}
