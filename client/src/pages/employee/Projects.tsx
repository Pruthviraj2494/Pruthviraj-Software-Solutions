import React, { useEffect, useState } from 'react'
import type { Project, ProjectStatus } from '../../types'
import { fetchProjects, updateProjectStatus } from '../../services/projects'
import { useToast } from '../../store/hooks'
import { Select } from '../../components/ui/Select'
import { Spinner } from '../../components/ui/Spinner'

const STATUS_OPTIONS: ProjectStatus[] = ['pending', 'active', 'completed']

const EmployeeProjects: React.FC = () => {
  const { push } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)


  useEffect(() => {
    loadProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const loadProjects = async () => {
    setLoading(true)
    try {
      const data = await fetchProjects()
      setProjects(data)
    } catch (err: any) {
      push(err?.message || 'Failed to load projects', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (project: Project, status: ProjectStatus) => {
    try {
      setUpdatingId(project._id)
      const updated = await updateProjectStatus(project._id, status)
      setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
      push('Project status updated', 'success')
    } catch (err: any) {
      push(err?.message || 'Failed to update status', 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My projects</h1>
      <p className="text-gray-600 mb-4">Assigned projects. Update status here.</p>

      <div className="bg-white shadow rounded border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    <span>Loading projects…</span>
                  </div>
                </td>
              </tr>
            )}
            {!loading && projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  No projects assigned yet.
                </td>
              </tr>
            )}
            {projects.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.description || ''}</div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {typeof p.client === 'string' ? p.client : p.client.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <Select
                    value={p.status}
                    onChange={(e) => handleStatusChange(p, e.target.value as ProjectStatus)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {updatingId === p._id && <span>Updating…</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EmployeeProjects

