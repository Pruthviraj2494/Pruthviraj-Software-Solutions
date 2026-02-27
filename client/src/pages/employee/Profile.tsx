import React, { useEffect, useState } from 'react'
import type { User } from '../../types'
import { getMyProfile, updateMyProfile } from '../../services/profile'
import { useToast } from '../../store/hooks'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'

const EmployeeProfile: React.FC = () => {
  const { push } = useToast()
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [password, setPassword] = useState('')


  useEffect(() => {
    const controller = new AbortController()
    loadProfile(controller.signal)
    return () => controller.abort()
  }, [])


  const loadProfile = async (signal: AbortSignal) => {
    setLoading(true)
    try {
      const u = await getMyProfile()
      if (!signal.aborted) setProfile(u)
    } catch (err: any) {
      if (!signal.aborted) {
        push(err?.message || 'Failed to load profile', 'error')
      }
    } finally {
      if (!signal.aborted) setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    try {
      setSaving(true)
      const updates: any = {
        name: profile.name,
        profile: profile.profile ?? {},
      }
      if (password) updates.password = password
      const updated = await updateMyProfile(updates)
      setProfile(updated)
      setPassword('')
      push('Profile updated', 'success')
    } catch (err: any) {
      push(err?.message || 'Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
        <span className="ml-3 text-sm text-gray-600">Loading profile…</span>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">My profile</h1>
      <form onSubmit={handleSave} className="max-w-xl space-y-4">
        <Input
          label="Name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
        <Input label="Email" value={profile.email} disabled />
        <Input
          label="Phone"
          value={profile.profile?.phone ?? ''}
          onChange={(e) =>
            setProfile({
              ...profile,
              profile: { ...profile.profile, phone: e.target.value },
            })
          }
        />
        <Input
          label="Position"
          value={profile.profile?.position ?? ''}
          onChange={(e) =>
            setProfile({
              ...profile,
              profile: { ...profile.profile, position: e.target.value },
            })
          }
        />
        <Input
          type="password"
          label="Password (leave blank to keep)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={saving} loading={saving}>
          Save changes
        </Button>
      </form>
    </div>
  )
}

export default EmployeeProfile

