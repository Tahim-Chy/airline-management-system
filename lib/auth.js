import jwt from 'jsonwebtoken';
export function signToken(payload) { return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); }
export function verifyToken(token) { try { return jwt.verify(token, process.env.JWT_SECRET); } catch (error) { return null; } }
export function getUserFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return verifyToken(authHeader.split(' ')[1]);
}
