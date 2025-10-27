import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'
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
      className="border-t border-gray-100 bg-white px-4 py-3 sticky bottom-0"
      onClick={() => textareaRef.current?.focus()}
    >
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <button type="button" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100" title="Attach">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.2-9.2a3.5 3.5 0 014.95 4.95l-9.2 9.2a1.5 1.5 0 01-2.12-2.12l8.49-8.49"/></svg>
        </button>
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={undefined}
            onBlur={undefined}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full resize-none px-4 py-2 border rounded-full focus:outline-none transition-shadow duration-150 max-h-40 overflow-y-auto bg-gray-50"
            tabIndex={0}
            aria-label="Message input"
          />

          {isNearLimit && message.length > 0 && (
            <div className="absolute bottom-2 right-3 pointer-events-none">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${remainingChars < 50 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{remainingChars}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled || !message.trim()}
          aria-label="Send message"
          className={`h-12 w-12 rounded-full flex items-center justify-center transition-transform duration-150 focus:ring-2 focus:ring-blue-300 ${
            message.trim() && !disabled
              ? 'bg-blue-600 text-white shadow-xl hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {/* Paper plane (send) icon - filled look for better visibility */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
            <path d="M2 21l20-9L2 3v7l15 2-15 2v6z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </form>
  )
}
