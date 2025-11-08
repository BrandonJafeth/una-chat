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
  const messageHandlerRef = useRef<((...args: unknown[]) => void) | null>(null)

  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      // API returns an ApiResponse<T> where `data` contains the payload (array of messages).
      // Use T = ChatMessage[] so resp.data is the messages array.
      const resp = await apiService.get<unknown>(`/chat/messages/history?limit=20`)
      // Accept multiple possible shapes from the API for robustness
      // 1) resp.data is ChatMessage[]
      // 2) resp.data.data is ChatMessage[]
      // 3) resp is already the array
      // Fallback to empty array
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyResp = resp as any
      let msgs: ChatMessage[] = []

      if (Array.isArray(anyResp?.data)) {
        msgs = anyResp.data
      } else if (Array.isArray(anyResp?.data?.data)) {
        msgs = anyResp.data.data
      } else if (Array.isArray(anyResp)) {
        msgs = anyResp
      }

      if (mountedRef.current && Array.isArray(msgs)) {
        setMessages(msgs)
        console.debug('[useChat] loaded history, messages:', msgs.length)
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
    console.log('🚀 [useChat] useEffect mounting - registering listeners')
    console.log('🔍 [useChat] Socket connected state:', socketService.isConnected())
    void loadHistory()

    const handleMessageReceived = (...args: unknown[]): void => {
      try {
        console.log('🔔 [useChat] handleMessageReceived called! Args:', args)
        
        const raw = args[0]
        const parsedMessage =
          typeof raw === 'string' ? (JSON.parse(raw) as ChatMessage) : (raw as ChatMessage)

        console.log('📩 [useChat] Parsed message:', parsedMessage)

        const sanitizedMessage: ChatMessage = {
          nombre: securityService.sanitizeText(parsedMessage.nombre || ''),
          mensaje: parsedMessage.mensaje || '',
          color: securityService.sanitizeText(parsedMessage.color || ''),
          timestamp: parsedMessage.timestamp || new Date().toISOString(),
        }

        setMessages((prev) => {
          console.log('✅ [useChat] Adding message to state. Current count:', prev.length)
          return [...prev, sanitizedMessage]
        })
        
        // ❌ REMOVED: loadHistory() causes messages to disappear temporarily
        // The backend broadcasts to ALL clients, so we receive our own messages too
      } catch (err) {
        console.error('❌ [useChat] Error parsing message:', err)
        setError('Failed to parse message')
      }
    }

    // Store handler in ref for re-registration
    messageHandlerRef.current = handleMessageReceived

    const handleError = (...args: unknown[]): void => {
      const errorMessage = args[0] as string
      setError(errorMessage)
      setIsLoading(false)
    }

    const handleConnectEvent = (): void => {
      console.log('🔌 [useChat] Socket reconnected - re-registering message listener')
      setError(null)
      
      // Re-register the message listener after reconnection
      if (messageHandlerRef.current) {
        off(SOCKET_EVENTS.MESSAGE_RECEIVED, messageHandlerRef.current)
        on(SOCKET_EVENTS.MESSAGE_RECEIVED, messageHandlerRef.current)
        console.log('✅ [useChat] Message listener re-registered after reconnection')
      }
    }

    console.log('📡 [useChat] Registering listener for:', SOCKET_EVENTS.MESSAGE_RECEIVED)
    on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
    console.log('✅ [useChat] Listener registered successfully')
    
    on(SOCKET_EVENTS.ERROR, handleError)
    on(SOCKET_EVENTS.CONNECTION, handleConnectEvent)

    return () => {
      console.log('🔌 [useChat] Cleaning up listeners on unmount')
      off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
      off(SOCKET_EVENTS.ERROR, handleError)
      off(SOCKET_EVENTS.CONNECTION, handleConnectEvent)
      mountedRef.current = false
    }
  }, [on, off, loadHistory])

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

    console.log('📨 [useChat] Sending payload to backend:', payload)
    console.log('   → Original message:', message)
    console.log('   → Sanitized payload:', payload)

    try {
      // Persist message via HTTP so backend stores it reliably
      const response = await apiService.post('/chat/messages', payload)
      console.log('✅ [useChat] Message sent successfully:', response)

      // Notify other clients via socket (best-effort)
      emit(SOCKET_EVENTS.MESSAGE_SEND, payload)
    } catch (err) {
      console.error('❌ [useChat] Error sending message:', err)
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
