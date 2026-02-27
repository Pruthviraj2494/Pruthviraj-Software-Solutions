import api, { getData } from './api'
import type { ApiResponse, User } from '../types'

export async function getMyProfile(): Promise<User> {
  const res = await api.get<ApiResponse<User>>('/users/me')
  return getData(res)
}

export async function updateMyProfile(updates: Partial<User> & { password?: string }): Promise<User> {
  const res = await api.put<ApiResponse<User>>('/users/me', updates)
  return getData(res)
}

