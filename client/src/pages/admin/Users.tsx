import React, { useEffect, useState } from 'react'
import type { User, UserRole } from '../../types'
import { fetchUsers, createUser, deleteUser } from '../../services/users'
import { useToast } from '../../store/hooks'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

const ROLE_OPTIONS: UserRole[] = ['admin', 'employee', 'client']

const AdminUsers: React.FC = () => {
  const { push } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')

  const [form, setForm] = useState<{
    name: string
    email: string
    password: string
    role: UserRole
  }>({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  })
  const [creating, setCreating] = useState(false)



  useEffect(() => {
    loadUsers(roleFilter === 'all' ? undefined : roleFilter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter])


  const loadUsers = async (role?: UserRole) => {
    setLoading(true)
    try {
      const data = await fetchUsers(role)
      setUsers(data)
    } catch (err: any) {
      push(err?.message || 'Failed to load users', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      push('Name, email and password are required', 'error')
      return
    }
    try {
      setCreating(true)
      await createUser(form)
      push('User created', 'success')
      setForm({ name: '', email: '', password: '', role: form.role })
      await loadUsers(roleFilter === 'all' ? undefined : roleFilter)
    } catch (err: any) {
      push(err?.message || 'Failed to create user', 'error')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await deleteUser(id)
      push('User deleted', 'success')
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== id))
    } catch (err: any) {
      push(err?.message || 'Failed to delete user', 'error')
    }
  }

  const resolveId = (user: User) => user.id || user._id

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User management</h1>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end">
        <div className="max-w-xs">
          <Select
            label="Filter by role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
          >
            <option value="all">All</option>
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mb-8">
        <Card title="Create user">
          <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-4 items-end">
            <div>
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Input
                type="email"
                label="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <Input
                type="password"
                label="Password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  label="Role"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
              </div>
              <Button type="submit" disabled={creating} loading={creating}>
                Create
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  Loading users…
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
            {users.map((u) => {
              const id = resolveId(u)
              if (!id) return null
              return (
                <tr key={id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{u.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">{u.role}</td>
                  <td className="px-4 py-2 text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default AdminUsers

