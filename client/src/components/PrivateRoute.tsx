import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const user = useAppSelector((s) => s.auth.user)
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default PrivateRoute
