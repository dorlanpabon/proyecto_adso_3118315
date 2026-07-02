import { useEffect, useState } from 'react';
import AppShell from '../components/AppShell';
import { apiRequest } from '../lib/api';

const EMPTY_FORM = {
  username: '',
  name: '',
  email: '',
  password: '',
  role: 'aprendiz',
  status: 'activo'
};

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadUsers() {
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/users');
      setUsers(data.users);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function openCreateModal() {
    setEditingUser(null);
    setForm(EMPTY_FORM);
    document.getElementById('user-modal').showModal();
  }

  function openEditModal(user) {
    setEditingUser(user);
    setForm({ ...user, password: '' });
    document.getElementById('user-modal').showModal();
  }

  function handleChange(event) {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const body = editingUser && !form.password
        ? { ...form, password: undefined }
        : form;

      await apiRequest(editingUser ? `/users/${editingUser.id}` : '/users', {
        method: editingUser ? 'PUT' : 'POST',
        body: JSON.stringify(body)
      });

      document.getElementById('user-modal').close();
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(user) {
    const confirmed = window.confirm(`¿Eliminar a ${user.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/users/${user.id}`, { method: 'DELETE' });
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-base-content/60">Gestión de coordinadores, instructores y aprendices.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          Crear usuario
        </button>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className="overflow-x-auto rounded-lg border border-base-300 bg-base-100">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6">Cargando usuarios...</td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan="6">No hay usuarios registrados.</td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id}>
                <td className="font-medium">{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td><span className="badge badge-outline capitalize">{user.role}</span></td>
                <td><span className={`badge ${user.status === 'activo' ? 'badge-success' : 'badge-ghost'} capitalize`}>{user.status}</span></td>
                <td className="text-right">
                  <button type="button" className="btn btn-ghost btn-xs" onClick={() => openEditModal(user)}>Editar</button>
                  <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => deleteUser(user)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="user-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-ghost btn-sm absolute right-2 top-2" type="submit">Cerrar</button>
          </form>
          <h2 className="mb-4 text-xl font-bold">{editingUser ? 'Editar usuario' : 'Crear usuario'}</h2>
          <form className="grid gap-3" onSubmit={handleSubmit}>
            <input className="input input-bordered" name="name" placeholder="Nombre completo" value={form.name} onChange={handleChange} required />
            <input className="input input-bordered" name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required />
            <input className="input input-bordered" name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} required />
            <input className="input input-bordered" name="password" type="password" placeholder={editingUser ? 'Nueva contraseña opcional' : 'Contraseña'} value={form.password} onChange={handleChange} required={!editingUser} />
            <select className="select select-bordered" name="role" value={form.role} onChange={handleChange}>
              <option value="coordinador">Coordinador</option>
              <option value="instructor">Instructor</option>
              <option value="aprendiz">Aprendiz</option>
            </select>
            <select className="select select-bordered" name="status" value={form.status} onChange={handleChange}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <button className="btn btn-primary mt-2" type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </form>
        </div>
      </dialog>
    </AppShell>
  );
}

export default Users;
