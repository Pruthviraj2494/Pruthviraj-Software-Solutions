import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addMessage } from '../store/slices/messagesSlice'
import { setConnected } from '../store/slices/socketSlice'
import { pushToast } from '../store/slices/toastSlice'

export type MessagePayload = {
  _id: string
  sender: string
  receiver: string
  content: string
  delivered: boolean
  read: boolean
  timestamp: string
}

type SocketContextType = {
  socket: Socket | null
  sendMessage: (payload: { sender: string; receiver: string; content: string }) => void
  sendReadReceipt: (messageId: string) => void
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  sendMessage: () => {},
  sendReadReceipt: () => {},
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((s) => s.auth.token)
  const user = useAppSelector((s) => s.auth.user)
  const userId = (user as { id?: string; _id?: string })?.id ?? (user as { id?: string; _id?: string })?._id
  const socketRef = useRef<Socket | null>(null)

  const sendMessage = useCallback((payload: { sender: string; receiver: string; content: string }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('message', payload)
    }
  }, [])

  const sendReadReceipt = useCallback((messageId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('read', messageId)
    }
  }, [])

  useEffect(() => {
    if (!token || !userId) return

    let origin: string = (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1'
    try {
      origin = new URL(origin).origin
    } catch {
      origin = 'http://localhost:5000'
    }

    const socket = io(origin, { auth: { token: `Bearer ${token}` }, transports: ['websocket'] })
    socketRef.current = socket

    socket.on('connect', () => {
      dispatch(setConnected(true))
      socket.emit('join', userId)
      dispatch(pushToast({ message: 'Connected to messaging', type: 'success' }))
    })

    socket.on('message', (msg: MessagePayload) => {
      dispatch(addMessage(msg))
    })

    socket.on('read', ({ messageId }: { messageId: string }) => {
      // In a richer UI we could mark the specific message as read for the sender.
      dispatch(pushToast({ message: 'Message read', type: 'info' }))
    })

    socket.on('disconnect', () => {
      dispatch(setConnected(false))
      dispatch(pushToast({ message: 'Disconnected from messaging', type: 'error' }))
    })

    return () => {
      socketRef.current = null
      socket.disconnect()
    }
  }, [token, userId, dispatch])

  const value: SocketContextType = {
    socket: socketRef.current,
    sendMessage,
    sendReadReceipt,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export { SocketContext }
