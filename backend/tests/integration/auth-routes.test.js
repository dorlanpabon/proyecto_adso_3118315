const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');

jest.mock('../../db/connection', () => ({
  query: jest.fn(),
  end: jest.fn()
}));

const pool = require('../../db/connection');
const app = require('../../app');

describe('auth and users routes', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  test('POST /login returns a token and sanitized user for valid credentials', async () => {
    const passwordHash = await bcrypt.hash('123', 4);
    pool.query.mockResolvedValueOnce([[
      {
        id: 1,
        username: 'admin',
        name: 'Administrador',
        email: 'admin@local.test',
        password_hash: passwordHash,
        role: 'coordinador',
        status: 'activo'
      }
    ]]);

    const response = await request(app)
      .post('/login')
      .send({ username: 'admin', password: '123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user.password_hash).toBeUndefined();
    expect(response.body.user.role).toBe('coordinador');
  });

  test('POST /api/login rejects invalid credentials', async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const response = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'bad' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Usuario o contraseña inválidos' });
  });

  test('GET /api/users rejects missing token', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Token requerido' });
  });

  test('GET /users returns users for coordinador token', async () => {
    const token = jwt.sign({ id: 1, role: 'coordinador' }, 'test-secret');
    pool.query.mockResolvedValueOnce([[
      {
        id: 1,
        username: 'admin',
        name: 'Administrador',
        email: 'admin@local.test',
        role: 'coordinador',
        status: 'activo'
      }
    ]]);

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(1);
    expect(response.body.users[0].password_hash).toBeUndefined();
  });
});
