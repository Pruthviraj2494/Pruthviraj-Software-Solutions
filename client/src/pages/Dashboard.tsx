import React from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { logout } from '../store/slices/authSlice'
import type { UserRole } from '../types'
import { Button } from '../components/ui/Button'
import { getRoleHome } from '../utils/role'
import { useNavigate } from 'react-router-dom'

const Dashboard: React.FC = () => {
  const user = useAppSelector((s) => s.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const role = (user?.role ?? 'client') as UserRole
  const homePath = getRoleHome(role)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-gray-700">Hello, {user.name}</span>}
          <Button type="button" variant="outline" size="sm" onClick={() => dispatch(logout())}>
            Logout
          </Button>
        </div>
      </div>

      <section className="mt-6 space-y-3">
        <p className="text-gray-600">
          This is the generic dashboard. You can jump to your role-specific home page for a more focused view.
        </p>
        <Button type="button" size="sm" onClick={() => navigate(homePath)}>
          Go to my {role} dashboard
        </Button>
      </section>
    </div>
  )
}

export default Dashboard
