import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { removeToast } from '../store/slices/toastSlice'

const ToastItem: React.FC<{ id: string; message: string; type?: 'info' | 'error' | 'success' }> = ({
  id,
  message,
  type,
}) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast({ id })), 5000)
    return () => clearTimeout(t)
  }, [id, dispatch])

  const colorClasses =
    type === 'error'
      ? 'border-red-200 bg-red-50 text-red-800'
      : type === 'success'
      ? 'border-green-200 bg-green-50 text-green-800'
      : 'border-blue-200 bg-blue-50 text-blue-800'

  const barColor =
    type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500'

  return (
    <div
      className={`flex w-full max-w-sm items-start gap-3 rounded-md border px-4 py-3 shadow-sm ${colorClasses}`}
    >
      <div className={`mt-0.5 h-8 w-1 rounded-full ${barColor}`} />
      <div className="flex-1 text-sm">{message}</div>
    </div>
  )
}

const ReduxToasts: React.FC = () => {
  const toasts = useAppSelector((s) => s.toast.toasts)
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} id={t.id} message={t.message} type={t.type} />
      ))}
    </div>
  )
}

export default ReduxToasts
