import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'
import { Button } from '../common/Button'
import { MAX_MESSAGE_LENGTH } from '../../utils/constants'

interface MessageInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
  onTextChange?: (text: string) => void
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
  onTextChange,
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage)
      setMessage('')
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setMessage(value)
      if (onTextChange) onTextChange(value)
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) {
        form.requestSubmit()
      }
    }
  }

  const remainingChars = MAX_MESSAGE_LENGTH - message.length
  const isNearLimit = remainingChars < 100

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white p-4"
      onClick={() => textareaRef.current?.focus()}
    >
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed max-h-32 overflow-y-auto pointer-events-auto z-10"
            tabIndex={0}
          />
          <Button
            type="submit"
            disabled={disabled || !message.trim()}
            variant="primary"
            size="md"
            className="self-end"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </Button>
          {/* intentionally no extra buttons here; only the send button */}
        </div>
        {isNearLimit && (
          <div className="text-right">
            <span
              className={`text-xs ${
                remainingChars < 50 ? 'text-red-600' : 'text-yellow-600'
              }`}
            >
              {remainingChars} characters remaining
            </span>
          </div>
        )}
      </div>
    </form>
  )
}
