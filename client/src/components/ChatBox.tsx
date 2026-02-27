import React, { useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { Input } from './ui/Input'
import { Button } from './ui/Button'

type ChatBoxProps = {
  receiverId: string
  senderId: string
  onSend?: (content: string) => void
}

const ChatBox: React.FC<ChatBoxProps> = ({ receiverId, senderId, onSend }) => {
  const [text, setText] = useState('')
  const { sendMessage } = useSocket()

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    sendMessage({ sender: senderId, receiver: receiverId, content: trimmed })
    if (onSend) {
      onSend(trimmed)
    }
    setText('')
  }

  return (
    <form onSubmit={handleSend} className="mt-3 border-t border-gray-100 pt-3 w-full h-full">
      <div className="flex items-center gap-2 w-full">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 w-full"
        />
        <Button type="submit" size="sm">
          Send
        </Button>
      </div>
    </form>
  )
}

export default ChatBox
