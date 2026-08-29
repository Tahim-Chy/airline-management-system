import { clockIn, clockOut, getOpenAttendance, getAttendanceHistory } from '../models/attendanceModel';
import { requireRole } from '../lib/auth';

export async function handleClockIn(req, res) {
  const user = requireRole(req, res, ['admin', 'crew']);
  if (!user) return;
  if (await getOpenAttendance(user.id)) return res.status(400).json({ error: 'Already clocked in' });
  const id = await clockIn(user.id);
  res.status(201).json({ message: 'Clocked in', attendanceId: id });
}
export async function handleClockOut(req, res) {
  const user = requireRole(req, res, ['admin', 'crew']);
  if (!user) return;
  const open = await getOpenAttendance(user.id);
  if (!open) return res.status(400).json({ error: 'You are not clocked in' });
  const workingHours = await clockOut(open.id);
  res.status(200).json({ message: 'Clocked out', workingHours });
}
export async function myAttendance(req, res) {
  const user = requireRole(req, res, ['admin', 'crew']);
  if (!user) return;
  res.status(200).json(await getAttendanceHistory(user.id));
}
