import React, { useEffect, useState } from 'react'
import type { ServiceRequest, User, Service } from '../../types'
import { fetchPendingRequests, approveServiceRequest } from '../../services/services'
import { useToast } from '../../store/hooks'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

type PopulatedRequest = ServiceRequest & { client: User; service: Service }

const AdminRequests: React.FC = () => {
  const { push } = useToast()
  const [requests, setRequests] = useState<PopulatedRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [projectNames, setProjectNames] = useState<Record<string, string>>({})
  const [projectDescriptions, setProjectDescriptions] = useState<Record<string, string>>({})


  useEffect(() => {
    loadRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const loadRequests = async () => {
    setLoading(true)
    try {
      const data = (await fetchPendingRequests()) as PopulatedRequest[]
      setRequests(data)
    } catch (err: any) {
      push(err?.message || 'Failed to load service requests', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (req: PopulatedRequest) => {
    try {
      setApprovingId(req._id)
      const projectName = projectNames[req._id] || req.service.name
      const projectDescription = projectDescriptions[req._id] || req.details || ''
      await approveServiceRequest({
        requestId: req._id,
        projectName,
        projectDescription: projectDescription || undefined,
      })
      push('Request approved and project created', 'success')
      setRequests((prev) => prev.filter((r) => r._id !== req._id))
    } catch (err: any) {
      push(err?.message || 'Failed to approve request', 'error')
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Service requests</h1>
      <p className="mb-6 text-gray-600">
        Pending client service requests. Approving a request will create a project for that client.
      </p>

      <Card className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Project name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Project description</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  Loading requests…
                </td>
              </tr>
            )}
            {!loading && requests.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  No pending requests.
                </td>
              </tr>
            )}
            {requests.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 text-sm text-gray-900">
                  <div className="font-medium">{(r.client as User).name}</div>
                  <div className="text-xs text-gray-500">{(r.client as User).email}</div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">{(r.service as Service).name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{r.details || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <Input
                    className="w-48"
                    value={projectNames[r._id] ?? ''}
                    placeholder={(r.service as Service).name}
                    onChange={(e) =>
                      setProjectNames((prev) => ({
                        ...prev,
                        [r._id]: e.target.value,
                      }))
                    }
                  />
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <Input
                    className="w-64"
                    value={projectDescriptions[r._id] ?? ''}
                    placeholder={r.details || 'Optional project description'}
                    onChange={(e) =>
                      setProjectDescriptions((prev) => ({
                        ...prev,
                        [r._id]: e.target.value,
                      }))
                    }
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    disabled={approvingId === r._id}
                    loading={approvingId === r._id}
                    onClick={() => handleApprove(r)}
                  >
                    Approve
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

export default AdminRequests

