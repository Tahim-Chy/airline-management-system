import { getBookingById, getTakenSeats, saveSeatsAndMeal } from '../models/bookingModel';

export async function getSeatMap(req, res) {
  try {
    const booking = await getBookingById(req.query.bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const taken = await getTakenSeats(booking.flight_id, booking.id);
    const alreadyChosen = booking.seat_numbers ? booking.seat_numbers.split(',') : [];

    res.status(200).json({
      booking_id: booking.id,
      flight_number: booking.flight_number,
      passenger_name: booking.passenger_name,
      seats_needed: booking.seat_count,
      total_seats: booking.total_seats,
      taken_seats: taken,
      current_selection: alreadyChosen,
      current_meal: booking.meal_preference,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load seat map' });
  }
}

export async function saveSeats(req, res) {
  try {
    const booking = await getBookingById(req.query.bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const { seats, meal_preference } = req.body;
    if (!Array.isArray(seats) || seats.length !== booking.seat_count) {
      return res.status(400).json({
        error: `Please select exactly ${booking.seat_count} seat(s)`,
      });
    }

    const taken = await getTakenSeats(booking.flight_id, booking.id);
    const conflict = seats.find((s) => taken.includes(s));
    if (conflict) {
      return res.status(409).json({ error: `Seat ${conflict} was just taken — pick another` });
    }

    await saveSeatsAndMeal(booking.id, {
      seat_numbers: seats.join(','),
      meal_preference: meal_preference || 'No Preference',
    });

    res.status(200).json({ message: 'Seats and meal preference saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save seat selection' });
  }
}
