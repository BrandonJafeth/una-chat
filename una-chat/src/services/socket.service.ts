import { io, type Socket } from 'socket.io-client'
import { SOCKET_URL, SOCKET_EVENTS, RECONNECT_DELAY } from '../utils/constants'

type SocketCallback = (...args: unknown[]) => void

class SocketService {
  private socket: Socket | null = null
  private listeners: Map<string, SocketCallback[]> = new Map()
  private connectionAttempts = 0
  private readonly MAX_RECONNECT_ATTEMPTS = 5

  connect(token?: string): void {
    if (this.socket?.connected) {
      return
    }

    this.socket = io(SOCKET_URL, {
      auth: token ? { token } : {},
      reconnectionDelay: RECONNECT_DELAY,
      reconnectionDelayMax: 5000,
      transports: ['websocket', 'polling'],
    })

    this.setupDefaultListeners()
  }

  private setupDefaultListeners(): void {
    if (!this.socket) return

    this.socket.on(SOCKET_EVENTS.CONNECTION, () => {
      console.info('Socket connected successfully')
      this.connectionAttempts = 0
    })

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason: string) => {
      console.warn('Socket disconnected:', reason)
      this.handleReconnection()
    })

    this.socket.on(SOCKET_EVENTS.ERROR, (error: Error) => {
      console.error('Socket error:', error)
    })

    this.socket.on('connect_error', (error: Error) => {
      console.error('Connection error:', error)
      this.connectionAttempts++
      
      if (this.connectionAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
        console.error('Max reconnection attempts reached')
        this.disconnect()
      }
    })
  }

  private handleReconnection(): void {
    if (this.connectionAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      setTimeout(() => {
        if (this.socket && !this.socket.connected) {
          this.socket.connect()
        }
      }, RECONNECT_DELAY)
    }
  }

  emit(event: string, data: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('Socket not connected. Cannot emit event:', event)
    }
  }

  on(event: string, callback: SocketCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)?.push(callback)
    this.socket?.on(event, callback)
  }

  off(event: string, callback?: SocketCallback): void {
    if (callback) {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
      this.socket?.off(event, callback)
    } else {
      this.listeners.delete(event)
      this.socket?.off(event)
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.listeners.clear()
    this.connectionAttempts = 0
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  getSocket(): Socket | null {
    return this.socket
  }
}

export const socketService = new SocketService()
export default socketService
