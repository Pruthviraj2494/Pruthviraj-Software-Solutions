import React, { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addMessage } from '../store/slices/messagesSlice'
import { setConnected } from '../store/slices/socketSlice'
import { pushToast } from '../store/slices/toastSlice'

const SocketManager: React.FC = () => {
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)
  const userId = (user as any)?.id || (user as any)?._id

  useEffect(() => {
    if (!token || !userId) return

    let origin = ((import.meta as any).env.VITE_API_BASE_URL as string) || 'http://localhost:5000/api/v1'
    try {
      origin = new URL(origin).origin
    } catch (e) {}

    const socket = io(origin, { auth: { token: `Bearer ${token}` }, transports: ['websocket'] })

    socket.on('connect', () => {
      dispatch(setConnected(true))
      socket.emit('join', userId)
      dispatch(pushToast({ message: 'Connected to messaging', type: 'success' }))
    })

    socket.on('message', (msg: any) => {
      dispatch(addMessage(msg))
    })

    socket.on('read', ({ messageId }: { messageId: string }) => {
      // mark read handled by messagesSlice via markRead action dispatched elsewhere if needed
      dispatch(pushToast({ message: 'Message read', type: 'info' }))
    })

    socket.on('disconnect', () => {
      dispatch(setConnected(false))
      dispatch(pushToast({ message: 'Disconnected from messaging', type: 'error' }))
    })

    return () => {
      try {
        socket?.disconnect()
      } catch (e) {
        // ignore
      }
    }
  }, [token, user])

  return null
}

export default SocketManager
