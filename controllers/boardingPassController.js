import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import { getBookingById } from '../models/bookingModel';
import { getTransporter } from '../lib/mailer';

async function buildBoardingPassData(bookingId) {
  const booking = await getBookingById(bookingId);
  if (!booking) return null;

  const qrPayload = JSON.stringify({
    bookingId: booking.id,
    flight: booking.flight_number,
    passenger: booking.passenger_name,
    seat: booking.seat_numbers || 'Not selected',
  });
  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1, width: 220 });

  return {
    booking_id: booking.id,
    passenger_name: booking.passenger_name,
    passenger_email: booking.passenger_email,
    flight_number: booking.flight_number,
    origin: booking.origin,
    destination: booking.destination,
    departure_time: booking.departure_time,
    arrival_time: booking.arrival_time,
    seat_numbers: booking.seat_numbers || 'Not selected yet',
    meal_preference: booking.meal_preference || 'No Preference',
    boarding_group: booking.boarding_group || 'General',
    qr_code: qrCodeDataUrl,
  };
}

export async function getBoardingPass(req, res) {
  try {
    const pass = await buildBoardingPassData(req.query.bookingId);
    if (!pass) return res.status(404).json({ error: 'Booking not found' });
    res.status(200).json(pass);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate boarding pass' });
  }
}

export async function emailBoardingPass(req, res) {
  try {
    const { booking_id } = req.body;
    if (!booking_id) return res.status(400).json({ error: 'Booking ID is required' });

    const pass = await buildBoardingPassData(booking_id);
    if (!pass) return res.status(404).json({ error: 'Booking not found' });

    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: '"Airline Management System" <no-reply@ams-demo.test>',
      to: pass.passenger_email,
      subject: `Your Boarding Pass — Flight ${pass.flight_number}`,
      html: `
        <h2>Boarding Pass</h2>
        <p><strong>${pass.passenger_name}</strong></p>
        <p>${pass.origin} → ${pass.destination} · Flight ${pass.flight_number}</p>
        <p>Departure: ${new Date(pass.departure_time).toLocaleString()}</p>
        <p>Seat: ${pass.seat_numbers} · Boarding Group: ${pass.boarding_group}</p>
        <p><img src="${pass.qr_code}" alt="Boarding pass QR code" /></p>
      `,
    });

    res.status(200).json({
      message: 'Boarding pass emailed successfully',
      preview_url: nodemailer.getTestMessageUrl(info) || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to email boarding pass' });
  }
}
