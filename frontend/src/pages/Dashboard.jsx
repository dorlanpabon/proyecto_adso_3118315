import AppShell from '../components/AppShell';
import { getSession } from '../lib/session';

function Dashboard() {
  const session = getSession();
  const user = session?.user;

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-base-content/60">Bienvenido, {user?.name || user?.username}.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Rol actual</p>
            <p className="text-2xl font-semibold capitalize">{user?.role}</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Cursos</p>
            <p className="text-2xl font-semibold">Pendiente</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <p className="text-sm text-base-content/60">Evidencias</p>
            <p className="text-2xl font-semibold">Pendiente</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

export default Dashboard
