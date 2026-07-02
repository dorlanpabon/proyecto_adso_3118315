import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';
import { setSession } from '../lib/session';

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleUsernameChange(event) {
    setUsername(event.target.value)
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value)
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      setSession(data);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-base-200 lg:grid-cols-[1fr_520px]">
      <section className="hidden items-center justify-center bg-primary p-12 text-primary-content lg:flex">
        <div className="max-w-xl">
          <p className="mb-3 text-lg font-semibold">ADSO Evidencias</p>
          <h1 className="text-5xl font-bold leading-tight">Calificación y seguimiento académico</h1>
          <p className="mt-5 text-lg text-primary-content/80">
            Plataforma para coordinadores, instructores y aprendices.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <form className="card w-full max-w-md bg-base-100 shadow-xl" method="post" onSubmit={handleSubmit}>
          <div className="card-body gap-4">
            <div>
              <h2 className="card-title text-2xl">Iniciar sesión</h2>
              <p className="text-sm text-base-content/60">Ingresa con tu usuario institucional.</p>
            </div>

            {error && <div className="alert alert-error py-2 text-sm">{error}</div>}

            <label className="form-control">
              <span className="label-text">Usuario</span>
              <input className="input input-bordered" type="text" name="username" id="username" placeholder="Nombre de usuario" value={username} onChange={handleUsernameChange} />
            </label>

            <label className="form-control">
              <span className="label-text">Contraseña</span>
              <input className="input input-bordered" type="password" name="password" id="password" placeholder="Contraseña" value={password} onChange={handlePasswordChange} />
            </label>

            <button className="btn btn-primary mt-2" type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default Login
