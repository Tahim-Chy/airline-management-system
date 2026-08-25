import { getOrCreateAccount, addPoints, getAccountByEmail, pointsForSpend, tierForPoints } from '../models/loyaltyModel';
import { getBookingById } from '../models/bookingModel';

export async function claimPoints(req, res) {
  try {
    const { booking_id } = req.body;
    if (!booking_id) return res.status(400).json({ error: 'Booking ID is required' });

    const booking = await getBookingById(booking_id);
    if (!booking) return res.status(404).json({ error: 'Booking not found — check the Booking ID' });

    await getOrCreateAccount(booking.passenger_email, booking.passenger_name);
    const earnedPoints = pointsForSpend(booking.total_price);
    const account = await addPoints(booking.passenger_email, earnedPoints);

    res.status(200).json({
      message: `${earnedPoints} points added!`,
      earned_points: earnedPoints,
      total_points: account.points,
      tier: tierForPoints(account.points),
      email: account.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to claim points' });
  }
}

export async function lookupAccount(req, res) {
  try {
    const account = await getAccountByEmail(req.query.email);
    if (!account) return res.status(404).json({ error: 'No loyalty account found for that email yet' });

    res.status(200).json({
      email: account.email,
      name: account.name,
      points: account.points,
      tier: tierForPoints(account.points),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to look up account' });
  }
}
