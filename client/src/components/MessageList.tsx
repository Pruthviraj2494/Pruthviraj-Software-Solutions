import React from 'react'
import type { Message, User } from '../types'

function getSenderId(sender: Message['sender']): string {
  return typeof sender === 'string' ? sender : (sender as User).id ?? (sender as User)._id ?? ''
}

const MessageList: React.FC<{ messages: Message[]; currentUserId: string }> = ({ messages, currentUserId }) => {
  return (
    <div className="space-y-2 overflow-auto p-3" style={{ maxHeight: '60vh' }}>
      {messages.map((message) => {
        const mine = getSenderId(message.sender) === currentUserId
        return (
          <div key={message._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-md rounded-2xl px-3 py-2 shadow-sm ${
                mine ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="text-sm">{message.content}</div>
              <div className="mt-1 text-[11px] text-gray-200">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MessageList
