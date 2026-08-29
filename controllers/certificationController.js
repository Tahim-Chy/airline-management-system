import { addCertification, getAllCertifications, getCertificationsForCrew } from '../models/certificationModel';
import { getAllCrew } from '../models/userModel';
import { requireRole } from '../lib/auth';

export function computeCertStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return 'Expired';
  if (daysLeft <= 30) return 'Expiring Soon';
  return 'Valid';
}

export async function create(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try {
    const { crew_id, certification_name, issue_date, expiry_date } = req.body;
    if (!crew_id || !certification_name || !issue_date || !expiry_date) return res.status(400).json({ error: 'All fields are required' });
    const id = await addCertification({ crew_id, certification_name, issue_date, expiry_date });
    res.status(201).json({ message: 'Certification added', id });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to add certification' }); }
}
export async function list(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  try {
    const [certs, crew] = await Promise.all([getAllCertifications(), getAllCrew()]);
    res.status(200).json({ certifications: certs.map((c) => ({ ...c, cert_status: computeCertStatus(c.expiry_date) })), crew });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch certifications' }); }
}
export async function myCertifications(req, res) {
  const user = requireRole(req, res, ['admin', 'crew']);
  if (!user) return;
  try {
    const certs = await getCertificationsForCrew(user.id);
    res.status(200).json(certs.map((c) => ({ ...c, cert_status: computeCertStatus(c.expiry_date) })));
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to fetch certifications' }); }
}
