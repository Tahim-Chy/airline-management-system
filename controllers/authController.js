import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createUser, findUserByEmail, setResetToken, findUserByResetToken, updatePasswordAndClearToken } from '../models/userModel';
import { signToken } from '../lib/auth';
import { getTransporter } from '../lib/mailer';
export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ error: 'All fields are required' });

    const ALLOWED_SELF_REGISTER_ROLES = ['passenger', 'crew', 'ground_staff'];
    if (!ALLOWED_SELF_REGISTER_ROLES.includes(role)) {
      return res.status(403).json({ error: 'That role cannot be self-registered. Choose Passenger, Crew, or Ground Staff.' });
    }

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await createUser({ name, email, passwordHash, role });
    res.status(201).json({ message: 'Registered successfully', userId });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Registration failed' }); }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });
    const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role });
    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Login failed' }); }
}

// New: forgot-password flow. Always responds with a generic success message,
// even if the email doesn't exist, so this endpoint can't be used to
// discover which emails have accounts.
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await findUserByEmail(email);
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await setResetToken(user.id, token, expiry);

      const transporter = await getTransporter();
      const resetUrl = `${req.headers.origin || ''}/reset-password?token=${token}`;
      const info = await transporter.sendMail({
        from: '"BRAC Airline Booking Service" <no-reply@brac-airline-demo.test>',
        to: user.email,
        subject: 'Reset your password',
        html: `<p>Hi ${user.name},</p><p>Click below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      });

      return res.status(200).json({
        message: 'If that email has an account, a reset link has been sent.',
        preview_url: nodemailer.getTestMessageUrl(info) || null,
      });
    }

    res.status(200).json({ message: 'If that email has an account, a reset link has been sent.' });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to process request' }); }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and new password are required' });

    const user = await findUserByResetToken(token);
    if (!user) return res.status(400).json({ error: 'This reset link is invalid or has expired' });

    const passwordHash = await bcrypt.hash(password, 10);
    await updatePasswordAndClearToken(user.id, passwordHash);
    res.status(200).json({ message: 'Password updated — you can now log in' });
  } catch (error) { console.error(error); res.status(500).json({ error: 'Failed to reset password' }); }
}
