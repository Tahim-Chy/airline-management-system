import jwt from 'jsonwebtoken';
export function signToken(payload) { return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }); }
export function verifyToken(token) { try { return jwt.verify(token, process.env.JWT_SECRET); } catch (error) { return null; } }
export function getUserFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return verifyToken(authHeader.split(' ')[1]);
}

// Server-side authorization guard. Call at the top of a controller function:
//   const user = requireRole(req, res, ['admin']);
//   if (!user) return; // response already sent (401 or 403)
// "admin" should always be included in allowedRoles for any role-restricted
// action, per the rule that admin can do everything.
export function requireRole(req, res, allowedRoles) {
  const user = getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: 'You must be logged in to do this' });
    return null;
  }
  if (!allowedRoles.includes(user.role)) {
    res.status(403).json({ error: 'Your account does not have permission to do this' });
    return null;
  }
  return user;
}
