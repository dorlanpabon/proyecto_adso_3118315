const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');

describe('auth middleware', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  function response() {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
  }

  test('authenticateToken rejects missing bearer token', () => {
    const req = { headers: {} };
    const res = response();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token requerido' });
    expect(next).not.toHaveBeenCalled();
  });

  test('authenticateToken attaches decoded user', () => {
    const token = jwt.sign({ id: 1, role: 'coordinador' }, 'test-secret');
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = response();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(req.user).toMatchObject({ id: 1, role: 'coordinador' });
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('authorizeRoles rejects users without permission', () => {
    const req = { user: { role: 'aprendiz' } };
    const res = response();
    const next = jest.fn();

    authorizeRoles('coordinador')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
