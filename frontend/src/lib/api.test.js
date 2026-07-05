import { beforeEach, describe, expect, test, vi } from 'vitest';
import { apiRequest } from './api';
import { getSession, setSession } from './session';

describe('apiRequest', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  test('sends bearer token when session exists', async () => {
    setSession({ token: 'token-123' });
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ ok: true })
    });

    await apiRequest('/users');

    expect(fetch).toHaveBeenCalledWith('http://localhost:3118/api/users', expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer token-123'
      })
    }));
  });

  test('clears session on 401 response', async () => {
    setSession({ token: 'token-123' });
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Token requerido' })
    });

    await expect(apiRequest('/users')).rejects.toThrow('Token requerido');
    expect(getSession()).toBeNull();
  });
});
