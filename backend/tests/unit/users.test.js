const { sanitizeUser, isValidRole, isValidStatus } = require('../../lib/users');

describe('users helpers', () => {
  test('sanitizeUser removes password_hash', () => {
    const user = sanitizeUser({
      id: 1,
      username: 'admin',
      name: 'Administrador',
      email: 'admin@local.test',
      password_hash: 'secret',
      role: 'coordinador',
      status: 'activo'
    });

    expect(user).toEqual({
      id: 1,
      username: 'admin',
      name: 'Administrador',
      email: 'admin@local.test',
      role: 'coordinador',
      status: 'activo'
    });
    expect(user.password_hash).toBeUndefined();
  });

  test('isValidRole accepts only supported roles', () => {
    expect(isValidRole('coordinador')).toBe(true);
    expect(isValidRole('instructor')).toBe(true);
    expect(isValidRole('aprendiz')).toBe(true);
    expect(isValidRole('admin')).toBe(false);
  });

  test('isValidStatus accepts only supported statuses', () => {
    expect(isValidStatus('activo')).toBe(true);
    expect(isValidStatus('inactivo')).toBe(true);
    expect(isValidStatus('bloqueado')).toBe(false);
  });
});
