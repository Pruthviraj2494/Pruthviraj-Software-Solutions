import React, { useEffect, useState } from 'react'
import type { Project, User } from '../../types'
import { fetchProjects } from '../../services/projects'
import { useToast } from '../../store/hooks'

const statusBadgeClasses: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
}

const ClientProjects: React.FC = () => {
  const { push } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchProjects()
      .then((data) => {
        if (!cancelled) setProjects(data)
      })
      .catch((err: any) => {
        if (!cancelled) push(err?.message || 'Failed to load projects', 'error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const renderEmployeeNames = (assigned: (User | string)[]) => {
    const employees = assigned
      .map((e) => (typeof e === 'string' ? null : e))
      .filter(Boolean) as User[]
    if (!employees.length) return <span className="text-gray-500">No employees assigned yet</span>
    return (
      <span className="text-sm text-gray-700">
        {employees.map((e) => e.name).join(', ')}
      </span>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My projects</h1>
      <p className="text-gray-600 mb-4">Projects created for your company.</p>

      {loading && <p className="text-gray-500">Loading projects…</p>}

      {!loading && !projects.length && (
        <p className="text-gray-500">No projects yet. Once an admin approves your service requests, projects will appear here.</p>
      )}

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded shadow p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-lg">{project.name}</h2>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusBadgeClasses[project.status] ?? 'bg-gray-100 text-gray-800'
                }`}
              >
                {project.status}
              </span>
            </div>
            {project.description && <p className="text-gray-700 mb-2">{project.description}</p>}
            <div className="text-sm text-gray-600">
              <div className="mb-1">
                <span className="font-medium">Assigned employees: </span>
                {renderEmployeeNames(project.assignedEmployees)}
              </div>
              <div className="text-xs text-gray-400">
                Created at {new Date(project.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClientProjects

