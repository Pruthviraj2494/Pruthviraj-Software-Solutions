import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Message } from '../../types'

const initialState: { messages: Message[] } = { messages: [] }

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload)
    },
    setConversation(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload
    },
    markRead(state, action: PayloadAction<{ messageId: string }>) {
      state.messages = state.messages.map((m) => (m._id === action.payload.messageId ? { ...m, read: true } : m))
    },
    clearMessages(state) {
      state.messages = []
    },
  },
})

export const { addMessage, setConversation, markRead, clearMessages } = messagesSlice.actions
export default messagesSlice.reducer
