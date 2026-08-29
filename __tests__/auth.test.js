import { signToken, verifyToken, getUserFromRequest, requireRole } from '../lib/auth';

function mockRes() {
  const res = {};
  res.statusCode = null;
  res.body = null;
  res.status = jest.fn((code) => { res.statusCode = code; return res; });
  res.json = jest.fn((body) => { res.body = body; return res; });
  return res;
}

describe('signToken / verifyToken', () => {
  test('a signed token verifies back to the same payload', () => {
    const token = signToken({ id: 1, role: 'admin' });
    const payload = verifyToken(token);
    expect(payload.id).toBe(1);
    expect(payload.role).toBe('admin');
  });

  test('an invalid token fails verification', () => {
    expect(verifyToken('not-a-real-token')).toBeNull();
  });
});

describe('getUserFromRequest', () => {
  test('returns null when there is no Authorization header', () => {
    expect(getUserFromRequest({ headers: {} })).toBeNull();
  });

  test('returns null when the header is not a Bearer token', () => {
    expect(getUserFromRequest({ headers: { authorization: 'Basic abc123' } })).toBeNull();
  });

  test('returns the decoded user for a valid Bearer token', () => {
    const token = signToken({ id: 7, role: 'crew' });
    const user = getUserFromRequest({ headers: { authorization: `Bearer ${token}` } });
    expect(user.id).toBe(7);
    expect(user.role).toBe('crew');
  });
});

describe('requireRole', () => {
  test('allows a user whose role is in the allowed list, and does not touch the response', () => {
    const token = signToken({ id: 1, role: 'admin' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const user = requireRole(req, res, ['admin']);
    expect(user).not.toBeNull();
    expect(user.role).toBe('admin');
    expect(res.status).not.toHaveBeenCalled();
  });

  test('rejects with 401 when there is no valid token at all', () => {
    const req = { headers: {} };
    const res = mockRes();
    const user = requireRole(req, res, ['admin']);
    expect(user).toBeNull();
    expect(res.statusCode).toBe(401);
  });

  test('rejects with 403 when the role is logged in but not allowed (e.g. a passenger hitting an admin route)', () => {
    const token = signToken({ id: 3, role: 'passenger' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const user = requireRole(req, res, ['admin']);
    expect(user).toBeNull();
    expect(res.statusCode).toBe(403);
  });

  test('a crew member cannot access an admin-only action', () => {
    const token = signToken({ id: 5, role: 'crew' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const user = requireRole(req, res, ['admin']);
    expect(user).toBeNull();
    expect(res.statusCode).toBe(403);
  });

  test('admin is allowed even on a crew-specific action, when explicitly included', () => {
    const token = signToken({ id: 1, role: 'admin' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const user = requireRole(req, res, ['admin', 'crew']);
    expect(user).not.toBeNull();
  });
});
