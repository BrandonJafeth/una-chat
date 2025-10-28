import { useState, useEffect, useCallback, useRef } from 'react'
import { useSocket } from './useSocket'
import { SOCKET_EVENTS } from '../utils/constants'
import { securityService } from '../services/security.service'
import { apiService } from '../services/api.service'
import { socketService } from '../services/socket.service'

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
  sendMessage: (message: ChatMessage) => Promise<void>
  clearMessages: () => void
  loadHistory: () => Promise<void>
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { emit, on, off } = useSocket()

  const mountedRef = useRef(true)
  const receivedViaSocketRef = useRef(false)
  const pollTimerRef = useRef<number | null>(null)

  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      // API returns an ApiResponse<T> where `data` contains the payload (array of messages).
      // Use T = ChatMessage[] so resp.data is the messages array.
      const resp = await apiService.get<ChatMessage[]>(`/chat/messages/history?limit=20`)
      const msgs = resp?.data ?? []

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
        const raw = args[0]
        const parsedMessage =
          typeof raw === 'string' ? (JSON.parse(raw) as ChatMessage) : (raw as ChatMessage)

        const sanitizedMessage: ChatMessage = {
          nombre: securityService.sanitizeText(parsedMessage.nombre || ''),
          mensaje: parsedMessage.mensaje || '',
          color: securityService.sanitizeText(parsedMessage.color || ''),
          timestamp: parsedMessage.timestamp || new Date().toISOString(),
        }

        setMessages((prev) => [...prev, sanitizedMessage])
        // mark that we received messages via socket so polling fallback can stop
        receivedViaSocketRef.current = true
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

    const handleConnectEvent = (): void => {
      // Clear stale errors and reload history when we regain connection
      setError(null)
      void loadHistory()
    }

    // Polling fallback: if we don't receive socket events, poll history until we do
    const startPollingFallback = (): void => {
      const POLL_INTERVAL = 2000 // 2s
      const MAX_POLL_DURATION = 30_000 // stop after 30s
      const start = Date.now()

      if (pollTimerRef.current) return

      console.debug('[useChat] starting polling fallback for history')
      pollTimerRef.current = window.setInterval(async () => {
        if (receivedViaSocketRef.current) {
          // stop polling once socket delivered messages
          if (pollTimerRef.current) {
            clearInterval(pollTimerRef.current)
            pollTimerRef.current = null
            console.debug('[useChat] polling fallback stopped (socket active)')
          }
          return
        }

        if (Date.now() - start > MAX_POLL_DURATION) {
          if (pollTimerRef.current) {
            clearInterval(pollTimerRef.current)
            pollTimerRef.current = null
            console.debug('[useChat] polling fallback stopped (timeout)')
          }
          return
        }

        try {
          await loadHistory()
        } catch (e) {
          console.debug('[useChat] polling fallback loadHistory failed', e)
        }
      }, POLL_INTERVAL)
    }

  on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
    on(SOCKET_EVENTS.ERROR, handleError)
    on(SOCKET_EVENTS.CONNECTION, handleConnectEvent)
    // start polling until we detect socket-delivered messages
    startPollingFallback()

    return () => {
      off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
      off(SOCKET_EVENTS.ERROR, handleError)
      off(SOCKET_EVENTS.CONNECTION, handleConnectEvent)
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current)
        pollTimerRef.current = null
      }
      mountedRef.current = false
    }
  }, [on, off])

  const sendMessage = useCallback(async (message: ChatMessage): Promise<void> => {
    if (!socketService.isConnected()) {
      setError('Not connected to server')
      console.warn('[useChat] sendMessage blocked: socketService reports disconnected')
      throw new Error('Not connected to server')
    }

    setIsLoading(true)
    setError(null)

    const payload = {
      nombre: securityService.sanitizeText(message.nombre),
      mensaje: securityService.sanitizeText(message.mensaje),
      color: securityService.sanitizeText(message.color),
      timestamp: message.timestamp || new Date().toISOString(),
    }

    try {
      // Persist message via HTTP so backend stores it reliably
      await apiService.post('/chat/messages', payload)

      // Notify other clients via socket (best-effort)
      emit(SOCKET_EVENTS.MESSAGE_SEND, payload)
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [emit])

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
