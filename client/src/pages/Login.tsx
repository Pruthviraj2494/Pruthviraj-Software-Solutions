import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { login as loginAction } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import type { UserRole } from '../types'
import { getRoleHome } from '../utils/role'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

const Login: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) navigate(getRoleHome(user.role as UserRole), { replace: true })
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await dispatch(loginAction({ email, password })).unwrap()
      const role = (result.user?.role ?? 'client') as UserRole
      navigate(getRoleHome(role))
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-md shadow-gray-200"
      >
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">Welcome back</h2>
        <p className="mb-6 text-sm text-gray-600">Sign in to continue to your dashboard.</p>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
        <div className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mt-6">
          <Button type="submit" fullWidth loading={loading}>
            Log in
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Login
