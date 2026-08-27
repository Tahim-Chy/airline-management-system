import { getTotalFlightCount, getTodayFlightCount } from '../models/flightModel';
import { getTodayBookingCount } from '../models/bookingModel';
import { getTotalRevenue } from '../models/analyticsModel';
import { getExpiringSoonCount } from '../models/certificationModel';
import { getActiveMaintenanceCount } from '../models/maintenanceModel';
import { getOpenFaultCount } from '../models/faultModel';

export async function getDashboardStats(req, res) {
  try {
    const [totalFlights, todayFlights, todayBookings, totalRevenue, expiringCerts, activeMaintenance, openFaults] = await Promise.all([
      getTotalFlightCount(),
      getTodayFlightCount(),
      getTodayBookingCount(),
      getTotalRevenue(),
      getExpiringSoonCount(),
      getActiveMaintenanceCount(),
      getOpenFaultCount(),
    ]);

    res.status(200).json({
      total_flights: totalFlights,
      today_flights: todayFlights,
      today_bookings: todayBookings,
      total_revenue: totalRevenue,
      alerts: {
        expiring_certifications: expiringCerts,
        active_maintenance: activeMaintenance,
        open_fault_reports: openFaults,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
}
