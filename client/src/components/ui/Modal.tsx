import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

export interface ModalProps {
  open: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
}

const modalRoot = typeof document !== 'undefined' ? document.body : null

export const Modal: React.FC<ModalProps> = ({ open, title, onClose, children }) => {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open || !modalRoot) return null

  const content = (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-md bg-white p-5 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          {title && <h2 className="text-sm font-semibold text-gray-900">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )

  return ReactDOM.createPortal(content, modalRoot)
}

export default Modal

