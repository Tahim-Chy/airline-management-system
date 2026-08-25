import { addCertification, getAllCertifications, getCertificationsForCrew, certStatus } from '../models/certificationModel';
import { getUserFromRequest } from '../lib/auth';

export async function add(req, res) {
  try {
    const { crew_id, certification_name, issue_date, expiry_date } = req.body;
    if (!crew_id || !certification_name || !issue_date || !expiry_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const id = await addCertification({ crew_id, certification_name, issue_date, expiry_date });
    res.status(201).json({ message: 'Certification recorded', id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record certification' });
  }
}

export async function listAll(req, res) {
  try {
    const certifications = await getAllCertifications();
    const withStatus = certifications.map((c) => ({ ...c, status: certStatus(c.expiry_date) }));
    res.status(200).json(withStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
}

export async function myGetCertifications(req, res) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: 'Not logged in' });

    const certifications = await getCertificationsForCrew(user.id);
    const withStatus = certifications.map((c) => ({ ...c, status: certStatus(c.expiry_date) }));
    res.status(200).json(withStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch certifications' });
  }
}
