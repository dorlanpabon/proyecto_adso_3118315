import { describe, expect, test } from 'vitest';
import { clearSession, getSession, setSession } from './session';

describe('session storage', () => {
  test('stores and reads the current session', () => {
    setSession({ token: 'abc', user: { username: 'admin' } });

    expect(getSession()).toEqual({ token: 'abc', user: { username: 'admin' } });
  });

  test('clears the current session', () => {
    setSession({ token: 'abc' });
    clearSession();

    expect(getSession()).toBeNull();
  });

  test('returns null and removes invalid JSON', () => {
    localStorage.setItem('adso_session', '{bad');

    expect(getSession()).toBeNull();
    expect(localStorage.getItem('adso_session')).toBeNull();
  });
});
