import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../services/api'
import type { User } from '../../types'

type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}

export const login = createAsyncThunk('auth/login', async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', { email, password })
    const data = res.data?.data
    if (!data) throw new Error('Invalid server response')
    // persist
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))
    return { user: data.user, token: data.accessToken }
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.status?.message || err.message || 'Login failed')
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  return true
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthFromStorage(state) {
      const token = localStorage.getItem('accessToken')
      const user = localStorage.getItem('user')
      if (token && user) {
        state.token = token
        state.user = JSON.parse(user)
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
    })
    builder.addCase(login.rejected, (state, action: any) => {
      state.loading = false
      state.error = action.payload || action.error.message
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null
      state.token = null
    })
  },
})

export const { setAuthFromStorage } = authSlice.actions
export default authSlice.reducer
