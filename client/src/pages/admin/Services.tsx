import React, { useEffect, useState } from 'react'
import type { Service } from '../../types'
import { fetchServices, createService } from '../../services/services'
import { useToast } from '../../store/hooks'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

const AdminServices: React.FC = () => {
  const { push } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<{ name: string; description: string }>({ name: '', description: '' })


  useEffect(() => {
    loadServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const loadServices = async () => {
    setLoading(true)
    try {
      const data = await fetchServices()
      setServices(data)
    } catch (err: any) {
      push(err?.message || 'Failed to load services', 'error')
    } finally {
      setLoading(false)
    }
  }


  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) {
      push('Service name is required', 'error')
      return
    }
    try {
      setCreating(true)
      const created = await createService({ name: form.name, description: form.description || undefined })
      push('Service created', 'success')
      setForm({ name: '', description: '' })
      setServices((prev) => [created, ...prev])
    } catch (err: any) {
      push(err?.message || 'Failed to create service', 'error')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Services</h1>

      <div className="mb-8 max-w-3xl">
        <Card title="Create service">
          <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-3 items-end">
            <div>
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <Input
                label="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <Button type="submit" disabled={creating} loading={creating}>
              Create
            </Button>
          </form>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                  Loading services…
                </td>
              </tr>
            )}
            {!loading && services.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                  No services created yet.
                </td>
              </tr>
            )}
            {services.map((s) => (
              <tr key={s._id}>
                <td className="px-4 py-2 text-sm text-gray-900">{s.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{s.description || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {s.createdAt ? new Date(s.createdAt).toLocaleString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default AdminServices

