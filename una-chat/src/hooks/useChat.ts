import { useState, useEffect, useCallback, useRef } from 'react'
import { useSocket } from './useSocket'
import { SOCKET_EVENTS } from '../utils/constants'
import { securityService } from '../services/security.service'
import { apiService } from '../services/api.service'

export interface ChatMessage {
  nombre: string
  mensaje: string
  color: string
  timestamp: string
}

interface UseChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (message: ChatMessage) => void
  clearMessages: () => void
  loadHistory: () => Promise<void>
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { emit, on, off, isConnected } = useSocket()

  const mountedRef = useRef(true)

  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const resp = await apiService.get<{ data: ChatMessage[] }>(`/chat/messages/history?limit=20`)
      const msgs = resp?.data?.data
      if (mountedRef.current && Array.isArray(msgs)) {
        setMessages(msgs)
      }
    } catch (err) {
      console.warn('Failed to load message history:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // load recent history on mount
    mountedRef.current = true
    void loadHistory()

    const handleMessageReceived = (...args: unknown[]): void => {
      try {
        const data = args[0] as string
        const parsedMessage = JSON.parse(data) as ChatMessage
        
        const sanitizedMessage: ChatMessage = {
          nombre: securityService.sanitizeText(parsedMessage.nombre),
          mensaje: parsedMessage.mensaje,
          color: securityService.sanitizeText(parsedMessage.color),
          timestamp: parsedMessage.timestamp,
        }

        setMessages((prev) => [...prev, sanitizedMessage])
      } catch (err) {
        console.error('Error parsing message:', err)
        setError('Failed to parse message')
      }
    }

    const handleError = (...args: unknown[]): void => {
      const errorMessage = args[0] as string
      setError(errorMessage)
      setIsLoading(false)
    }

  on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
    on(SOCKET_EVENTS.ERROR, handleError)

    return () => {
      off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
      off(SOCKET_EVENTS.ERROR, handleError)
      mountedRef.current = false
    }
  }, [on, off])

  const sendMessage = useCallback((message: ChatMessage): void => {
    if (!isConnected) {
      setError('Not connected to server')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const messageToSend = JSON.stringify({
        nombre: securityService.sanitizeText(message.nombre),
        mensaje: securityService.sanitizeText(message.mensaje),
        color: securityService.sanitizeText(message.color),
      })

      emit(SOCKET_EVENTS.MESSAGE_SEND, messageToSend)
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }, [emit, isConnected])

  const clearMessages = useCallback((): void => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    loadHistory,
  }
}
