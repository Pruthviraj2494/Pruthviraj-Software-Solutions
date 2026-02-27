import React, { useEffect, useState } from 'react'
import type { DashboardStats } from '../../types'
import { fetchDashboardStats } from '../../services/dashboard'
import { useToast } from '../../store/hooks'
import { Card } from '../../components/ui/Card'

const AdminDashboard: React.FC = () => {
  const { push } = useToast()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    loadStats(controller.signal)
    return () => controller.abort()
  }, [])

  const loadStats = async (signal: AbortSignal) => {
    setLoading(true)
    try {
      const data = await fetchDashboardStats()
      if (!signal.aborted) {
        setStats(data)
      }
    } catch (err: any) {
      if (!signal.aborted) {
        push(err?.message || 'Failed to load dashboard stats', 'error')
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Admin Dashboard</h1>
      <p className="mb-6 text-gray-600">High-level overview of your company activity.</p>
      {loading && <p className="text-sm text-gray-500">Loading stats…</p>}
      {stats && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Total users" value={stats.users} />
          <StatCard label="Employees" value={stats.employees} />
          <StatCard label="Clients" value={stats.clients} />
          <StatCard label="Projects" value={stats.projects} />
          <StatCard label="Services" value={stats.services} />
          <StatCard label="Pending service requests" value={stats.pendingServiceRequests} highlight />
        </div>
      )}
    </div>
  )
}

const StatCard: React.FC<{ label: string; value: number; highlight?: boolean }> = ({
  label,
  value,
  highlight,
}) => (
  <Card
    className={`flex flex-col gap-1 ${
      highlight ? 'border-amber-300 bg-amber-50' : ''
    }`}
  >
    <div className="text-xs font-medium uppercase text-gray-500">{label}</div>
    <div className="text-2xl font-semibold text-gray-900">{value}</div>
  </Card>
)

export default AdminDashboard

