import { useRef, useEffect } from 'react'
import { type ChatMessage } from '../../hooks/useChat'
import { Message } from './Message'
import { Loading } from '../common/Loading'

interface MessageListProps {
  messages: ChatMessage[]
  currentUsername?: string
  isLoading?: boolean
}

export function MessageList({
  messages,
  currentUsername,
  isLoading = false,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (isLoading && messages.length === 0) {
    return <Loading message="Loading messages..." />
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center px-4">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-50 animate-pulse" />
            </div>
            <svg
              className="w-20 h-20 mx-auto text-gray-400 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Start a conversation</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Send a message to start chatting. You can share text, images, and videos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 chat-scrollbar bg-white">
      <div className="max-w-3xl mx-auto space-y-3">
        {messages.map((message, index) => (
          <Message
            key={`${message.timestamp}-${index}`}
            message={message}
            isOwn={currentUsername === message.nombre}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
