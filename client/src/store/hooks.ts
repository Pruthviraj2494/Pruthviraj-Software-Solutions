import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import type { RootState, AppDispatch } from './index'
import { pushToast } from './slices/toastSlice'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

type ToastType = 'info' | 'error' | 'success'
export function useToast() {
  const dispatch = useAppDispatch()
  const push = useCallback(
    (message: string, type: ToastType = 'info') => {
      dispatch(pushToast({ message, type }))
    },
    [dispatch],
  )
  return { push }
}
