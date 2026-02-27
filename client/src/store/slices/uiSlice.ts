import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type UIState = {
  selectedConversationUserId: string | null
  sidebarOpen: boolean
  modalOpen: boolean
}

const initialState: UIState = {
  selectedConversationUserId: null,
  sidebarOpen: true,
  modalOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedConversationUserId(state, action: PayloadAction<string | null>) {
      state.selectedConversationUserId = action.payload
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setModalOpen(state, action: PayloadAction<boolean>) {
      state.modalOpen = action.payload
    },
  },
})

export const {
  setSelectedConversationUserId,
  setSidebarOpen,
  toggleSidebar,
  setModalOpen,
} = uiSlice.actions
export default uiSlice.reducer
