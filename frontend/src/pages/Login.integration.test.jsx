import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import Login from './Login';
import { getSession } from '../lib/session';

describe('Login page', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  test('stores session and navigates to dashboard on successful login', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        token: 'jwt-token',
        user: {
          id: 1,
          username: 'admin',
          name: 'Administrador',
          email: 'admin@local.test',
          role: 'coordinador',
          status: 'activo'
        }
      })
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<p>Dashboard OK</p>} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText('Usuario'), 'admin');
    await userEvent.type(screen.getByLabelText('Contraseña'), '123');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => expect(screen.getByText('Dashboard OK')).toBeInTheDocument());
    expect(getSession()).toMatchObject({ token: 'jwt-token' });
  });
});
