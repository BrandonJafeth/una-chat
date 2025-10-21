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
    // Use flex-1 and min-h-0 so this component behaves as a flex child and
    // doesn't push sibling input out of view when there are no messages.
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm mt-2">Be the first to send a message!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message, index) => (
        <Message
          key={`${message.timestamp}-${index}`}
          message={message}
          isOwn={currentUsername === message.nombre}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}
