import nodemailer from 'nodemailer';
let cachedTransporter = null;
export async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  const testAccount = await nodemailer.createTestAccount();
  cachedTransporter = nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, secure: false, auth: { user: testAccount.user, pass: testAccount.pass } });
  return cachedTransporter;
}
