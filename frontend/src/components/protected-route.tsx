import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = true

  // Boolean(localStorage.getItem("authToken"));

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
