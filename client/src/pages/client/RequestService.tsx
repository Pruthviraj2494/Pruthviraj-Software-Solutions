import React, { useEffect, useState } from 'react'
import type { Service } from '../../types'
import { fetchServices, requestService } from '../../services/services'
import { useToast } from '../../store/hooks'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'

const ClientRequestService: React.FC = () => {
  const { push } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadServices = async (signal: AbortSignal) => {
    setLoading(true)
    try {
      const data = await fetchServices()
      if (!signal.aborted) {
        setServices(data)
      }
    } catch (err: any) {
      if (!signal.aborted) {
        push(err?.message || 'Failed to load services', 'error')
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    loadServices(controller.signal)
    return () => controller.abort()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedServiceId) {
      push('Please choose a service to request', 'error')
      return
    }
    try {
      setSubmitting(true)
      await requestService({ serviceId: selectedServiceId, details: details.trim() || undefined })
      push('Service request submitted. An admin will review it.', 'success')
      setDetails('')
    } catch (err: any) {
      push(err?.message || 'Failed to submit service request', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Request service</h1>
      <p className="text-gray-600 mb-4">
        Select a service and submit a request. An admin will approve and create a project for you.
      </p>

      {loading && (
        <div className="mb-4 flex items-center text-gray-500">
          <Spinner size="sm" />
          <span className="ml-2 text-sm">Loading services…</span>
        </div>
      )}

      {!loading && !services.length && (
        <p className="text-gray-500 mb-4">No services are available yet. Please contact an admin.</p>
      )}

      {!!services.length && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <Select
              label="Service"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="details">
              Details (optional)
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full border rounded px-3 py-2 h-32"
              placeholder="Describe your requirements or context for this service."
            />
          </div>

          <Button type="submit" disabled={submitting} loading={submitting}>
            Submit request
          </Button>
        </form>
      )}
    </div>
  )
}

export default ClientRequestService

