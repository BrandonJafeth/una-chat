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

    console.info('[socketService] connect() called', { url: SOCKET_URL, hasToken: !!token })
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

    // 🔍 DEBUG: Log EVERY event that arrives from server
    this.socket.onAny((event: string, ...args: unknown[]) => {
      console.log('🔔 [socketService] INCOMING EVENT:', event)
      console.log('📦 [socketService] Event data:', args)
    })

    // Attach any listeners that were registered before the socket existed
    try {
      console.log('🔄 [socketService] Starting listener re-attachment process...')
      console.log('📊 [socketService] Total events with listeners:', this.listeners.size)
      
      for (const [event, callbacks] of this.listeners.entries()) {
        console.log(`🔗 [socketService] Re-attaching ${callbacks.length} listener(s) for event: "${event}"`)
        for (const cb of callbacks) {
          this.socket.on(event, cb)
        }
      }
      console.log('✅ [socketService] Listener re-attachment complete')
    } catch (error) {
      console.warn('[socketService] failed to re-attach stored listeners', error)
    }

    this.socket.on(SOCKET_EVENTS.CONNECTION, () => {
      console.info('✅ [socketService] Socket connected successfully', { id: this.socket?.id })
      this.connectionAttempts = 0
    })

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason: string) => {
      console.warn('⚠️ [socketService] Socket disconnected:', reason, { connected: this.socket?.connected, id: this.socket?.id })
      this.handleReconnection()
    })

    this.socket.on(SOCKET_EVENTS.ERROR, (error: Error) => {
      console.error('❌ [socketService] Socket error:', error)
    })

    this.socket.on('connect_error', (error: Error) => {
      console.error('❌ [socketService] connect_error:', error)
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
      try {
        console.debug('[socketService] emitting', event, data)
        this.socket.emit(event, data)
      } catch (error) {
        console.error('[socketService] emit failed:', error)
      }
    } else {
      console.warn('Socket not connected. Cannot emit event:', event)
    }
  }

  on(event: string, callback: SocketCallback): void {
    console.log(`📌 [socketService] Storing listener for event: "${event}"`)
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
      console.log(`   → Created new listener array for: "${event}"`)
    }
    this.listeners.get(event)?.push(callback)
    console.log(`   → Total listeners for "${event}":`, this.listeners.get(event)?.length)
    
    if (this.socket?.connected) {
      console.log(`   → Socket is connected, attaching listener immediately`)
      this.socket.on(event, callback)
    } else {
      console.log(`   → Socket not connected yet, will attach on connect`)
    }
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
