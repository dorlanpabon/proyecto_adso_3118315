import { Navigate } from 'react-router-dom';
import { getSession } from '../lib/session';

function ProtectedRoute({ children }) {
  const session = getSession();

  if (!session?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
