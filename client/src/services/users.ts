import api, { getData } from './api'
import type { ApiResponse, User, UserRole } from '../types'

export async function fetchUsers(role?: UserRole): Promise<User[]> {
  const res = await api.get<ApiResponse<User[]>>('/users', {
    params: role ? { role } : undefined,
  })
  return getData(res)
}

export async function createUser(payload: {
  name: string
  email: string
  password: string
  role: UserRole
  profile?: { phone?: string; company?: string; position?: string }
}): Promise<User> {
  const res = await api.post<ApiResponse<User>>('/users', payload)
  return getData(res)
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete<ApiResponse<null>>(`/users/${id}`)
}

export async function fetchAdmins(): Promise<User[]> {
  const res = await api.get<ApiResponse<User[]>>('/users/admins')
  return getData(res)
}

