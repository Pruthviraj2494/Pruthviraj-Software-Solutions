import React, { useEffect, useMemo, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setSelectedConversationUserId } from '../store/slices/uiSlice'
import { markRead } from '../store/slices/messagesSlice'
import MessageList from '../components/MessageList'
import ChatBox from '../components/ChatBox'
import { fetchConversation, markMessageRead } from '../services/messages'
import { fetchProjects } from '../services/projects'
import { fetchUsers, fetchAdmins } from '../services/users'
import type { Project, UserRole, User, Message } from '../types'
import { Button } from '../components/ui/Button'
import { useSocket } from '../context/SocketContext'

const MessagesPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const messages = useAppSelector((s) => s.messages.messages)
  const selectedConversationUserId = useAppSelector((s) => s.ui.selectedConversationUserId)
  const [conversation, setConversation] = useState<typeof messages>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [admins, setAdmins] = useState<User[]>([])
  const [adminLoading, setAdminLoading] = useState(false)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const { sendReadReceipt } = useSocket()

  useEffect(() => {
    // merge live socket messages into conversation for the active thread
    if (!selectedConversationUserId || !user) return
    const currentUserId = (user as { id?: string }).id ?? (user as { _id?: string })._id ?? ''
    const relevant = messages.filter((m) => {
      const senderId = typeof m.sender === 'string' ? m.sender : (m.sender as User).id ?? (m.sender as User)._id ?? ''
      const receiverId =
        typeof m.receiver === 'string' ? m.receiver : (m.receiver as User).id ?? (m.receiver as User)._id ?? ''
      const otherId = senderId === currentUserId ? receiverId : senderId
      return otherId === selectedConversationUserId
    })
    setConversation((prev) => {
      const existingIds = new Set(prev.map((p) => p._id))
      const merged = [...prev]
      relevant.forEach((m) => {
        if (!existingIds.has(m._id)) {
          merged.push(m)
        }
      })
      return merged
    })
  }, [messages, selectedConversationUserId, user])

  // Load projects so we can derive contacts for employee/client
  useEffect(() => {
    const controller = new AbortController()
    if (user) {
      loadProjects(controller.signal)
    }
    return () => controller.abort()
  }, [user])

  // Load admins once for employee/client to be able to message admin
  useEffect(() => {
    const controller = new AbortController()
    if (user) {
      loadAdmins(controller.signal)
    }
    return () => controller.abort()
  }, [user])

  // For admins, load all users so they see every user in contacts
  useEffect(() => {
    if (!user || user.role !== 'admin') return
    let cancelled = false
    const loadAllUsers = async () => {
      try {
        const data = await fetchUsers()
        if (!cancelled) setAllUsers(data)
      } catch (err) {
        // ignore; contacts will just fall back to project-based inference
        console.error(err)
      }
    }
    loadAllUsers()
    return () => {
      cancelled = true
    }
  }, [user])

  useEffect(() => {
    if (!selectedConversationUserId) {
      setConversation([])
      return
    }
    let cancelled = false
    fetchConversation(selectedConversationUserId).then((data) => {
      if (!cancelled) setConversation(data)
    })
    return () => {
      cancelled = true
    }
  }, [selectedConversationUserId])

  useEffect(() => {
    if (!user || !selectedConversationUserId || conversation.length === 0) return

    const currentUserId = (user as { id?: string }).id ?? (user as { _id?: string })._id ?? ''
    const unreadForMe = conversation.filter((m) => {
      if (m.read) return false
      const receiverId =
        typeof m.receiver === 'string' ? m.receiver : (m.receiver as User).id ?? (m.receiver as User)._id ?? ''
      return receiverId === currentUserId
    })

    if (unreadForMe.length === 0) return

    unreadForMe.forEach(async (m) => {
      try {
        const updated = await markMessageRead(m._id)
        if (updated) {
          dispatch(markRead({ messageId: updated._id }))
          sendReadReceipt(updated._id)
        }
      } catch (err) {
        // ignore individual failures; best-effort read marking
        // eslint-disable-next-line no-console
        console.error('Failed to mark message read', err)
      }
    })
  }, [conversation, user, selectedConversationUserId])


  const role = (user?.role ?? 'client') as UserRole



  const loadAdmins = async (signal: AbortSignal) => {
    if (!user) return
    setAdminLoading(true)
    try {
      const data = await fetchAdmins()
      if (!signal.aborted) {
        setAdmins(data)
      }
    } catch (err: any) {
      console.log(err)
      // ignore
    } finally {
      if (!signal.aborted) {
        setAdminLoading(false)
      }
    }
  }


  const loadProjects = async (signal: AbortSignal) => {
    if (!user) return
    try {
      const data = await fetchProjects()
      if (!signal.aborted) {
        setProjects(data)
      }
    } catch (err: any) {
      console.log(err)
    }
  }

  const contacts = useMemo(() => {
    if (!user) return []
    const map = new Map<string, { id: string; name: string; label: string }>()
    const currentUserId = (user as { id?: string }).id ?? (user as { _id?: string })._id ?? ''

    if (role === 'admin') {
      const usersSource = allUsers.length ? allUsers : []
      usersSource.forEach((u) => {
        const id = u.id || u._id
        if (!id || id === currentUserId || map.has(id)) return
        const roleLabel = u.role === 'admin' ? 'admin' : u.role === 'employee' ? 'employee' : 'client'
        map.set(id, { id, name: u.name, label: `${u.name} (${roleLabel})` })
      })
    } else if (role === 'employee') {
      const firstAdmin = admins[0]
      if (firstAdmin) {
        const adminId = firstAdmin.id || firstAdmin._id
        if (adminId) {
          map.set(adminId, {
            id: adminId,
            name: firstAdmin.name,
            label: `${firstAdmin.name} (admin)`,
          })
        }
      }
      projects.forEach((p) => {
        const client = p.client as any as User | string
        if (client && typeof client !== 'string') {
          const id = client.id || client._id
          if (id && !map.has(id)) {
            map.set(id, { id, name: client.name, label: `${client.name} (client)` })
          }
        }
      })
    } else if (role === 'client') {
      // Client: admin + assigned employees
      const firstAdmin = admins[0]
      if (firstAdmin) {
        const adminId = firstAdmin.id || firstAdmin._id
        if (adminId) {
          map.set(adminId, {
            id: adminId,
            name: firstAdmin.name,
            label: `${firstAdmin.name} (admin)`,
          })
        }
      }
      projects.forEach((p) => {
        p.assignedEmployees.forEach((emp) => {
          if (typeof emp === 'string') return
          const id = emp.id || emp._id
          if (!id) return
          if (!map.has(id)) {
            map.set(id, { id, name: emp.name, label: `${emp.name} (employee)` })
          }
        })
      })
    }
    return Array.from(map.values())
  }, [projects, role, user, allUsers])



  useEffect(() => {
    if (contacts && contacts.length) {
      dispatch(setSelectedConversationUserId(contacts[0].id || null))
    }
  }, [contacts])

  const handleLocalSend = (content: string) => {
    if (!selectedConversationUserId || !user) return
    const currentUserId = (user as { id?: string }).id ?? (user as { _id?: string })._id ?? ''
    const now = new Date().toISOString()
    const localMessage: Message = {
      _id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sender: currentUserId,
      receiver: selectedConversationUserId,
      content,
      delivered: false,
      read: false,
      timestamp: now,
    }
    setConversation((prev) => [...prev, localMessage])
  }

  const handleSelectConversation = (otherId: string) => {
    dispatch(setSelectedConversationUserId(otherId || null))
  }

  if (!user) return null

  const userId = (user as { id?: string }).id ?? (user as { _id?: string })._id ?? ''

  return (
    <div className="h-full p-6 pb-6">
      <h1 className="mb-4 text-2xl font-bold">Messages</h1>
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-3 h-full">
        <aside className="h-full rounded border border-gray-100 bg-white shadow-sm md:col-span-1">
          <div className="border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-700">Contacts</h2>
          </div>
          <div className="max-h-80 overflow-auto">
            {contacts.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-500">No contacts available yet.</p>
            )}
            <ul>
              {contacts.map((c) => (
                <li key={c.id}>
                  <Button
                    type="button"
                    variant={selectedConversationUserId === c.id ? 'secondary' : 'ghost'}
                    size="sm"
                    fullWidth
                    className={`justify-start ${selectedConversationUserId === c.id
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      : 'text-gray-800 hover:bg-gray-50'
                      }`}
                    onClick={() => handleSelectConversation(c.id)}
                  >
                    {c.label}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="rounded border border-gray-100 bg-white p-4 shadow-sm md:col-span-2">
          {!selectedConversationUserId && (
            <p className="text-sm text-gray-500">Select a contact to start chatting.</p>
          )}
          {selectedConversationUserId && (
            <>
              <MessageList messages={conversation} currentUserId={userId} />
              <ChatBox receiverId={selectedConversationUserId} senderId={userId} onSend={handleLocalSend} />
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default MessagesPage
