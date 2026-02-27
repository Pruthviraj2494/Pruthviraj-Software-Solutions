import React, { useEffect, useMemo, useState } from 'react'
import type { Project, ProjectStatus } from '../../types'
import { fetchProjects } from '../../services/projects'
import { useToast } from '../../store/hooks'
import { Card } from '../../components/ui/Card'

const EmployeeDashboard: React.FC = () => {
  const { push } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [])


  const load = async (signal: AbortSignal) => {
    setLoading(true)
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
        setLoading(false)
      }
    }
  }

  const stats = useMemo(() => {
    const total = projects.length
    const byStatus: Record<ProjectStatus, number> = {
      pending: 0,
      active: 0,
      completed: 0,
    }
    projects.forEach((p) => {
      byStatus[p.status] = (byStatus[p.status] ?? 0) + 1
    })
    return { total, byStatus }
  }, [projects])

  const recent = projects.slice(0, 3)

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Employee Dashboard</h1>
      <p className="mb-6 text-gray-600">Overview of your assigned projects.</p>

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="mb-1 text-xs font-medium uppercase text-gray-500">Total projects</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
        </Card>
        <Card>
          <div className="mb-1 text-xs font-medium uppercase text-gray-500">Active</div>
          <div className="text-2xl font-semibold text-blue-600">{stats.byStatus.active}</div>
        </Card>
        <Card>
          <div className="mb-1 text-xs font-medium uppercase text-gray-500">Completed</div>
          <div className="text-2xl font-semibold text-green-600">{stats.byStatus.completed}</div>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent projects</h2>
        {loading && <p className="text-sm text-gray-500">Loading your projects…</p>}
        {!loading && recent.length === 0 && (
          <p className="text-sm text-gray-500">No projects assigned yet. New assignments will appear here.</p>
        )}
        <div className="space-y-3">
          {recent.map((p) => (
            <Card
              key={p._id}
              className="flex items-center justify-between border-gray-100 px-4 py-3"
            >
              <div>
                <div className="text-sm font-medium">{p.name}</div>
                {p.description && <div className="text-xs text-gray-600">{p.description}</div>}
                <div className="mt-1 text-[11px] text-gray-400">
                  Created {new Date(p.createdAt).toLocaleString()}
                </div>
              </div>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-800">
                {p.status}
              </span>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default EmployeeDashboard
