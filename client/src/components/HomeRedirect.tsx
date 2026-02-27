import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import type { UserRole } from '../types'
import { getRoleHome } from '../utils/role'

/** Redirects / to role home if logged in, else to /login */
const HomeRedirect: React.FC = () => {
  const user = useAppSelector((s) => s.auth.user)
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={getRoleHome(user.role as UserRole)} replace />
}

export default HomeRedirect
