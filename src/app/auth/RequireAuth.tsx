import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getToken } from './auth'

export function RequireAuth() {
  const token = getToken()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
