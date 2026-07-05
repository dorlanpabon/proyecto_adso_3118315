import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import { setSession } from '../lib/session';

describe('ProtectedRoute', () => {
  test('redirects anonymous users to login', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route path="/dashboard" element={<ProtectedRoute><p>Dashboard privado</p></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  test('renders protected content when session exists', () => {
    setSession({ token: 'abc', user: { role: 'coordinador' } });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route path="/dashboard" element={<ProtectedRoute><p>Dashboard privado</p></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard privado')).toBeInTheDocument();
  });
});
