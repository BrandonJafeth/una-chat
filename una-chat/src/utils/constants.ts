export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

export const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || ''
export const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || ''
export const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || ''
export const AUTH0_REDIRECT_URI = import.meta.env.VITE_AUTH0_REDIRECT_URI || 'http://localhost:5173/callback'

export const MAX_MESSAGE_LENGTH = 5000
export const MAX_USERNAME_LENGTH = 50
export const MIN_USERNAME_LENGTH = 3

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVED: 'message:received',
  ERROR: 'error',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  USER_JOINED: 'user:joined',
  USER_LEFT: 'user:left',
} as const

export const DEFAULT_COLORS = [
  '#FF5733', '#3498DB', '#2ECC71', '#9B59B6', '#F39C12',
  '#E74C3C', '#1ABC9C', '#34495E', '#E67E22', '#95A5A6',
]

export const MESSAGE_RATE_LIMIT = {
  windowMs: 60000,
  maxMessages: 30,
}

export const RECONNECT_DELAY = 3000
export const CONNECTION_TIMEOUT = 10000
