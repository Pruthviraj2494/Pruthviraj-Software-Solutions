import axios, { type AxiosResponse } from 'axios'
import type { ApiResponse } from '../types'

const baseURL = ((import.meta as any).env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getData<T>(res: AxiosResponse<ApiResponse<T>>): T {
  const payload = res.data
  if (!payload) {
    throw new Error('Empty response from server')
  }
  const { status, data } = payload
  if (status && typeof status.code === 'number' && status.code !== 0) {
    throw new Error(status.message || 'Request failed')
  }
  return data as T
}

export default api
