import api, { getData } from './api'
import type { Message, ApiResponse } from '../types'

export const fetchConversation = async (otherId: string): Promise<Message[]> => {
  const res = await api.get<ApiResponse<Message[]>>(`/messages/${otherId}`)
  return getData(res)
}

export const markMessageRead = async (messageId: string): Promise<Message | undefined> => {
  const res = await api.put<ApiResponse<Message>>(`/messages/${messageId}/read`)
  return getData(res)
}
