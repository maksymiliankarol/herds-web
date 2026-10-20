import { Navigate, Outlet, useLocation } from 'react-router'
import { getProfileName } from '../lib/profile'

export type ProfileContext = { name: string }

export function RequireProfile() {
  const location = useLocation()
  const name = getProfileName()

  if (!name) {
    return <Navigate to="/profile" replace state={{ from: location.pathname }} />
  }

  return <Outlet context={{ name } satisfies ProfileContext} />
}