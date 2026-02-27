import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import type { UserRole } from '../types'
import { getRoleHome } from '../utils/role'

type RoleRouteProps = {
  allowedRoles: UserRole[]
  children: React.ReactElement
}

const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const user = useAppSelector((s) => s.auth.user)
  if (!user) return <Navigate to="/login" replace />
  const role = user.role as UserRole
  if (!allowedRoles.includes(role)) return <Navigate to={getRoleHome(role)} replace />
  return children
}

export default RoleRoute
