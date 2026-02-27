import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import messagesReducer from './slices/messagesSlice'
import toastReducer from './slices/toastSlice'
import socketReducer from './slices/socketSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    toast: toastReducer,
    socket: socketReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
