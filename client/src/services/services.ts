import api, { getData } from './api'
import type { ApiResponse, Service, ServiceRequest, Project } from '../types'

export async function fetchServices(): Promise<Service[]> {
  const res = await api.get<ApiResponse<Service[]>>('/services')
  return getData(res)
}

export async function requestService(payload: {
  serviceId: string
  details?: string
}): Promise<ServiceRequest> {
  const res = await api.post<ApiResponse<ServiceRequest>>('/services/request', payload)
  return getData(res)
}

export async function createService(payload: {
  name: string
  description?: string
}): Promise<Service> {
  const res = await api.post<ApiResponse<Service>>('/services', payload)
  return getData(res)
}

export async function fetchPendingRequests(): Promise<ServiceRequest[]> {
  const res = await api.get<ApiResponse<ServiceRequest[]>>('/services/requests')
  return getData(res)
}

export async function fetchMyServiceRequests(): Promise<ServiceRequest[]> {
  const res = await api.get<ApiResponse<ServiceRequest[]>>('/services/my-requests')
  return getData(res)
}

export async function approveServiceRequest(payload: {
  requestId: string
  projectName?: string
  projectDescription?: string
}): Promise<{ request: ServiceRequest; project: Project }> {
  const res = await api.post<ApiResponse<{ request: ServiceRequest; project: Project }>>(
    '/services/approve',
    payload,
  )
  return getData(res)
}


