import nodemailer from 'nodemailer';

// Uses Ethereal (nodemailer's built-in fake SMTP service) so the team doesn't
// need real email credentials to demo this feature. Every "sent" email gets
// a preview URL you can open in a browser to see exactly what was sent.
//
// To switch to real email later (e.g. Gmail with an app password), replace
// this function's body with:
//   return nodemailer.createTransport({
//     host: 'smtp.gmail.com', port: 587,
//     auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
//   });

let cachedTransporter = null;

export async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const testAccount = await nodemailer.createTestAccount();
  cachedTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  return cachedTransporter;
}
