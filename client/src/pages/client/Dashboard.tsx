import React, { useEffect, useState } from 'react'
import type { Project, ServiceRequest } from '../../types'
import { fetchProjects } from '../../services/projects'
import { fetchMyServiceRequests } from '../../services/services'
import { useToast } from '../../store/hooks'
import { Card } from '../../components/ui/Card'

const statusBadgeClasses: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
}

const requestStatusClasses: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  approved: 'bg-green-50 text-green-800 border border-green-200',
  rejected: 'bg-red-50 text-red-800 border border-red-200',
}

const ClientDashboard: React.FC = () => {
  const { push } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [requestsLoading, setRequestsLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    loadProjects(controller.signal)
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadRequests(controller.signal)
    return () => controller.abort()
  }, [])



  const loadProjects = async (signal: AbortSignal) => {
    setProjectsLoading(true)
    try {
      const data = await fetchProjects()
      if (!signal.aborted) {
        setProjects(data)
      }
    } catch (err: any) {
      if (!signal.aborted) {
        push(err?.message || 'Failed to load projects', 'error')
      }
    } finally {
      if (!signal.aborted) {
        setProjectsLoading(false)
      }
    }
  }


  const loadRequests = async (signal: AbortSignal) => {
    setRequestsLoading(true)
    try {
      const data = await fetchMyServiceRequests()
      if (!signal.aborted) {
        setRequests(data)
      }
    } catch (err: any) {
      if (!signal.aborted) {
        push(err?.message || 'Failed to load service requests', 'error')
      }
    } finally {
      if (!signal.aborted) {
        setRequestsLoading(false)
      }
    }
  }

  const recentProjects = projects.slice(0, 3)
  const recentRequests = requests.slice(0, 5)

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Client Dashboard</h1>
      <p className="mb-6 text-gray-600">Your projects and service requests.</p>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold">Recent projects</h2>
        {projectsLoading && <p className="text-sm text-gray-500">Loading your projects…</p>}
        {!projectsLoading && recentProjects.length === 0 && (
          <p className="text-sm text-gray-500">
            No projects yet. Once an admin approves your service requests, projects will appear here.
          </p>
        )}
        <div className="space-y-3">
          {recentProjects.map((project) => (
            <Card
              key={project._id}
              className="flex items-center justify-between border-gray-100 px-4 py-3"
            >
              <div>
                <div className="text-sm font-medium">{project.name}</div>
                {project.description && <div className="text-xs text-gray-600">{project.description}</div>}
                <div className="mt-1 text-[11px] text-gray-400">
                  Created {new Date(project.createdAt).toLocaleString()}
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                  statusBadgeClasses[project.status] ?? 'bg-gray-100 text-gray-800'
                }`}
              >
                {project.status}
              </span>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Service requests</h2>
        {requestsLoading && <p className="text-sm text-gray-500">Loading your service requests…</p>}
        {!requestsLoading && recentRequests.length === 0 && (
          <p className="text-sm text-gray-500">
            No service requests yet. You can create one from the <span className="font-medium">Request service</span> page.
          </p>
        )}
        <div className="space-y-3">
          {recentRequests.map((req) => {
            const serviceName =
              typeof req.service === 'string' ? req.service : (req.service as { name?: string }).name ?? 'Service'
            return (
              <Card
                key={req._id}
                className={`flex items-center justify-between border ${
                  requestStatusClasses[req.status] ?? 'bg-gray-50 text-gray-800 border-gray-200'
                }`}
              >
                <div>
                  <div className="text-sm font-medium">{serviceName}</div>
                  {req.details && <div className="max-w-xs truncate text-xs opacity-80">{req.details}</div>}
                  <div className="mt-1 text-[11px] opacity-70">
                    Requested {new Date(req.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right text-xs font-semibold uppercase tracking-wide">{req.status}</div>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default ClientDashboard

