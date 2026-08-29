// Tests should run standalone, without needing a real .env.local or database
// configured — this gives the auth tests a fixed dummy secret to sign/verify
// tokens with. Never use this value for anything real.
process.env.JWT_SECRET = 'jest-test-secret-do-not-use-in-production';
