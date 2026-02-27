import React, { useEffect, useState } from 'react'
import type { Project, User } from '../../types'
import {
  fetchProjects,
  createProject,
  assignEmployeeToProject,
  unassignEmployeeFromProject,
  updateProject,
} from '../../services/projects'
import { fetchUsers } from '../../services/users'
import { useToast } from '../../store/hooks'
import { Select } from '../../components/ui/Select'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'

const AdminProjects: React.FC = () => {
  const { push } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<User[]>([])
  const [employees, setEmployees] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<{ name: string; description: string; clientId: string }>({
    name: '',
    description: '',
    clientId: '',
  })
  const [assigningProjectId, setAssigningProjectId] = useState<string | null>(null)
  const [assignEmployeeId, setAssignEmployeeId] = useState<Record<string, string>>({})
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editingValues, setEditingValues] = useState<Record<string, { name: string; description: string }>>({})


  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const loadAll = async () => {
    setLoading(true)
    try {
      const [projectsData, clientsData, employeesData] = await Promise.all([
        fetchProjects(),
        fetchUsers('client'),
        fetchUsers('employee'),
      ])
      setProjects(projectsData)
      setClients(clientsData)
      setEmployees(employeesData)
    } catch (err: any) {
      push(err?.message || 'Failed to load projects or users', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.clientId) {
      push('Project name and client are required', 'error')
      return
    }
    try {
      setCreating(true)
      const created = await createProject({
        name: form.name,
        description: form.description || undefined,
        client: form.clientId,
      })
      push('Project created', 'success')
      setProjects((prev) => [created, ...prev])
      setForm({ name: '', description: '', clientId: '' })
    } catch (err: any) {
      push(err?.message || 'Failed to create project', 'error')
    } finally {
      setCreating(false)
    }
  }

  const handleAssign = async (projectId: string) => {
    const employeeId = assignEmployeeId[projectId]
    if (!employeeId) {
      push('Choose an employee to assign', 'error')
      return
    }
    try {
      setAssigningProjectId(projectId)
      const updated = await assignEmployeeToProject(projectId, employeeId)
      setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
      push('Employee assigned', 'success')
    } catch (err: any) {
      push(err?.message || 'Failed to assign employee', 'error')
    } finally {
      setAssigningProjectId(null)
    }
  }

  const handleUnassign = async (projectId: string, employeeId: string) => {
    try {
      setAssigningProjectId(projectId)
      const updated = await unassignEmployeeFromProject(projectId, employeeId)
      setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
      push('Employee unassigned', 'success')
    } catch (err: any) {
      push(err?.message || 'Failed to unassign employee', 'error')
    } finally {
      setAssigningProjectId(null)
    }
  }

  const getClientName = (project: Project) => {
    const c = project.client as any as User | string
    if (typeof c === 'string') {
      const found = clients.find((cl) => cl.id === c || cl._id === c)
      return found?.name ?? c
    }
    return c.name
  }

  const getEmployeeLabel = (id: string) => {
    const e = employees.find((emp) => emp.id === id || emp._id === id)
    return e?.name ?? id
  }

  const startEdit = (project: Project) => {
    setEditingProjectId(project._id)
    setEditingValues((prev) => ({
      ...prev,
      [project._id]: {
        name: project.name,
        description: project.description ?? '',
      },
    }))
  }

  const cancelEdit = () => {
    setEditingProjectId(null)
  }

  const handleEditChange = (projectId: string, field: 'name' | 'description', value: string) => {
    setEditingValues((prev) => ({
      ...prev,
      [projectId]: {
        ...(prev[projectId] ?? { name: '', description: '' }),
        [field]: value,
      },
    }))
  }

  const handleSaveEdit = async (project: Project) => {
    const values = editingValues[project._id]
    if (!values) {
      setEditingProjectId(null)
      return
    }
    if (!values.name.trim()) {
      push('Project name is required', 'error')
      return
    }
    try {
      const updated = await updateProject(project._id, {
        name: values.name.trim(),
        description: values.description.trim() || undefined,
      })
      setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
      push('Project updated', 'success')
      setEditingProjectId(null)
    } catch (err: any) {
      push(err?.message || 'Failed to update project', 'error')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Create project</h2>
        <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-4 items-end max-w-4xl">
          <div>
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <Select
              label="Client"
              value={form.clientId}
              onChange={(e) => setForm((f) => ({ ...f, clientId: e.target.value }))}
            >
              <option value="">Select client</option>
              {clients.map((c) => {
                const id = c.id || c._id
                if (!id) return null
                return (
                  <option key={id} value={id}>
                    {c.name}
                  </option>
                )
              })}
            </Select>
          </div>
          <div>
          <Input
              label="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
         
            <div className="mt-3">
              <Button type="submit" fullWidth disabled={creating} loading={creating}>
                Create
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Employees</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    <span>Loading projects…</span>
                  </div>
                </td>
              </tr>
            )}
            {!loading && projects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                  No projects yet.
                </td>
              </tr>
            )}
            {projects.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {editingProjectId === p._id ? (
                    <div className="space-y-1">
                      <Input
                        label="Name"
                        value={editingValues[p._id]?.name ?? ''}
                        onChange={(e) => handleEditChange(p._id, 'name', e.target.value)}
                      />
                      <Input
                        label="Description"
                        value={editingValues[p._id]?.description ?? ''}
                        onChange={(e) => handleEditChange(p._id, 'description', e.target.value)}
                      />
                      <div className="mt-2 flex gap-2">
                        <Button type="button" size="sm" onClick={() => handleSaveEdit(p)}>
                          Save
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.description || ''}</div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="mt-1 px-0 text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => startEdit(p)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{getClientName(p)}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{p.status}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.assignedEmployees.map((idOrUser) => {
                      const id = typeof idOrUser === 'string' ? idOrUser : idOrUser.id || idOrUser._id
                      if (!id) return null
                      const label =
                        typeof idOrUser === 'string' ? getEmployeeLabel(id) : (idOrUser as User).name ?? getEmployeeLabel(id)
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-800"
                        >
                          {label}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="p-0 text-gray-500 hover:text-red-600"
                            onClick={() => handleUnassign(p._id, id)}
                          >
                            ×
                          </Button>
                        </span>
                      )
                    })}
                    {p.assignedEmployees.length === 0 && (
                      <span className="text-xs text-gray-400">No employees assigned</span>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Select
                      value={assignEmployeeId[p._id] ?? ''}
                      onChange={(e) =>
                        setAssignEmployeeId((prev) => ({
                          ...prev,
                          [p._id]: e.target.value,
                        }))
                      }
                    >
                      <option value="">Assign employee…</option>
                      {employees.map((e) => {
                        const id = e.id || e._id
                        if (!id) return null
                        return (
                          <option key={id} value={id}>
                            {e.name}
                          </option>
                        )
                      })}
                    </Select>
                    <Button
                      type="button"
                      size="sm"
                      disabled={assigningProjectId === p._id}
                      loading={assigningProjectId === p._id}
                      onClick={() => handleAssign(p._id)}
                    >
                      Assign
                    </Button>
                  </div>
                </td>
                <td className="px-4 py-2" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProjects

