import { useState, useEffect, useCallback } from 'react'
import { socketService } from '../services/socket.service'
import { SOCKET_EVENTS } from '../utils/constants'

interface UseSocketReturn {
  isConnected: boolean
  emit: (event: string, data: unknown) => void
  on: (event: string, callback: (...args: unknown[]) => void) => void
  off: (event: string, callback?: (...args: unknown[]) => void) => void
}

export function useSocket(): UseSocketReturn {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    socketService.connect()

    const handleConnect = (): void => {
      setIsConnected(true)
    }

    const handleDisconnect = (): void => {
      setIsConnected(false)
    }

    socketService.on(SOCKET_EVENTS.CONNECTION, handleConnect)
    socketService.on(SOCKET_EVENTS.DISCONNECT, handleDisconnect)

    setIsConnected(socketService.isConnected())

    return () => {
      socketService.off(SOCKET_EVENTS.CONNECTION, handleConnect)
      socketService.off(SOCKET_EVENTS.DISCONNECT, handleDisconnect)
    }
  }, [])

  const emit = useCallback((event: string, data: unknown) => {
    socketService.emit(event, data)
  }, [])

  const on = useCallback((event: string, callback: (...args: unknown[]) => void) => {
    socketService.on(event, callback)
  }, [])

  const off = useCallback((event: string, callback?: (...args: unknown[]) => void) => {
    socketService.off(event, callback)
  }, [])

  return {
    isConnected,
    emit,
    on,
    off,
  }
}
