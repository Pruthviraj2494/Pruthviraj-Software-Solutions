import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Toast = { id: string; message: string; type?: 'info' | 'error' | 'success' }

const initialState: { toasts: Toast[] } = { toasts: [] }

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    pushToast(state, action: PayloadAction<{ message: string; type?: Toast['type'] }>) {
      const id = Date.now().toString()
      state.toasts.unshift({ id, message: action.payload.message, type: action.payload.type })
    },
    removeToast(state, action: PayloadAction<{ id: string }>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload.id)
    },
    clearToasts(state) {
      state.toasts = []
    },
  },
})

export const { pushToast, removeToast, clearToasts } = toastSlice.actions
export default toastSlice.reducer
