import { Link, NavLink, useNavigate } from 'react-router-dom';
import { clearSession, getSession } from '../lib/session';

function AppShell({ children }) {
  const navigate = useNavigate();
  const session = getSession();
  const user = session?.user;
  const isCoordinator = user?.role === 'coordinador';

  function handleLogout() {
    clearSession();
    navigate('/login', { replace: true });
  }

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-primary text-primary-content' : 'text-base-content hover:bg-base-200'}`;

  return (
    <div className="app-shell flex bg-base-200">
      <aside className="hidden w-72 border-r border-base-300 bg-base-100 p-5 lg:block">
        <Link to="/dashboard" className="mb-8 block">
          <p className="text-xl font-bold text-primary">ADSO Evidencias</p>
          <p className="text-sm text-base-content/60">Gestión académica</p>
        </Link>
        <nav className="flex flex-col gap-1">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          {isCoordinator && <NavLink to="/usuarios" className={linkClass}>Usuarios</NavLink>}
          <span className="rounded-lg px-3 py-2 text-sm text-base-content/40">Cursos</span>
          <span className="rounded-lg px-3 py-2 text-sm text-base-content/40">Evidencias</span>
          <span className="rounded-lg px-3 py-2 text-sm text-base-content/40">Calificaciones</span>
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-base-300 bg-base-100 px-4 py-3 md:px-8">
          <div>
            <p className="font-semibold">{user?.name || user?.username}</p>
            <p className="text-sm capitalize text-base-content/60">{user?.role}</p>
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
            Salir
          </button>
        </header>
        <section className="p-4 md:p-8">{children}</section>
      </main>
    </div>
  );
}

export default AppShell;
