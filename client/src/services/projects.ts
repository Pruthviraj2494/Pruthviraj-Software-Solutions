import api, { getData } from './api'
import type { ApiResponse, Project, ProjectStatus } from '../types'

export async function fetchProjects(): Promise<Project[]> {
  const res = await api.get<ApiResponse<Project[]>>('/projects')
  return getData(res)
}

export async function createProject(payload: {
  name: string
  description?: string
  client: string
  assignedEmployees?: string[]
}): Promise<Project> {
  const res = await api.post<ApiResponse<Project>>('/projects', payload)
  return getData(res)
}

export async function assignEmployeeToProject(projectId: string, employeeId: string): Promise<Project> {
  const res = await api.post<ApiResponse<Project>>(`/projects/${projectId}/assign`, { employeeId })
  return getData(res)
}

export async function unassignEmployeeFromProject(projectId: string, employeeId: string): Promise<Project> {
  const res = await api.post<ApiResponse<Project>>(`/projects/${projectId}/unassign`, { employeeId })
  return getData(res)
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus): Promise<Project> {
  const res = await api.post<ApiResponse<Project>>(`/projects/${projectId}/status`, { status })
  return getData(res)
}

export async function updateProject(
  projectId: string,
  updates: Partial<Pick<Project, 'name' | 'description' | 'status'>>,
): Promise<Project> {
  const res = await api.put<ApiResponse<Project>>(`/projects/${projectId}`, updates)
  return getData(res)
}

