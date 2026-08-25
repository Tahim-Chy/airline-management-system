import { createRequest, getAllRequests, updateRequestStatus } from '../models/assistanceModel';
import { getBookingById } from '../models/bookingModel';

const VALID_TYPES = ['Wheelchair', 'Medical Support', 'Visual Impairment', 'Hearing Impairment', 'Other'];

export async function submit(req, res) {
  try {
    const { booking_id, request_type, notes } = req.body;
    if (!booking_id || !request_type) {
      return res.status(400).json({ error: 'Booking ID and request type are required' });
    }
    if (!VALID_TYPES.includes(request_type)) {
      return res.status(400).json({ error: `Request type must be one of: ${VALID_TYPES.join(', ')}` });
    }

    const booking = await getBookingById(booking_id);
    if (!booking) return res.status(404).json({ error: 'Booking not found — check the Booking ID' });

    const id = await createRequest({ booking_id, request_type, notes });
    res.status(201).json({ message: 'Assistance request submitted', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
}

export async function list(req, res) {
  try {
    const requests = await getAllRequests();
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
}

export async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    await updateRequestStatus(req.query.id, status);
    res.status(200).json({ message: 'Status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update status' });
  }
}
