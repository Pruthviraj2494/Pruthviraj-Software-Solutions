/**
 * Toasts are stored in Redux (toastSlice). Use useToast from store/hooks.
 * This file re-exports for backward compatibility; ToastProvider is a no-op.
 */
import React from 'react'

export { useToast } from '../store/hooks'

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>

export default {}
