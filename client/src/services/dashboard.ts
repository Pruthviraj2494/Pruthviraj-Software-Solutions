import api, { getData } from './api'
import type { ApiResponse, DashboardStats } from '../types'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats')
  return getData(res)
}

