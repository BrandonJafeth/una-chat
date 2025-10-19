# 🤖 Especificaciones para Agentes de IA

**Proyecto:** UNA Chat Backend - Implementación Segura de Aplicaciones  
**Objetivo Principal:** Máxima calidad de código, seguridad y mantenibilidad  
**Enfoque:** SSDLC (Secure Software Development Lifecycle)

---

## 📋 Tabla de Contenidos

1. [Principios Generales](#principios-generales)
2. [Convenciones Backend](#convenciones-backend)
3. [Convenciones Frontend](#convenciones-frontend)
4. [Estándares de Seguridad](#estándares-de-seguridad)
5. [Flujo de Desarrollo](#flujo-de-desarrollo)
6. [Checklist de Calidad](#checklist-de-calidad)

---

## 🎯 Principios Generales

### SOLID Principles (Obligatorio)
- **S** - Single Responsibility: Una función/clase debe tener una única razón para cambiar
- **O** - Open/Closed: Abierto para extensión, cerrado para modificación
- **L** - Liskov Substitution: Los objetos derivados pueden sustituir a los base
- **I** - Interface Segregation: Interfaces específicas, no genéricas
- **D** - Dependency Inversion: Depender de abstracciones, no de implementaciones

### Legibilidad y Convención
- ✅ Código autodocumentado (nombres claros y descriptivos)
- ✅ Sin comentarios innecesarios (el código debe ser obviamente legible)
- ✅ Sin emojis en el código
- ✅ Variables/funciones en inglés
- ✅ Máximo nivel de anidamiento: 3 niveles
- ✅ Máximo 50 líneas por función (preferible 20-30)

### Testing First (BDD)
- ✅ Escribir pruebas ANTES que el código (Test-Driven Development)
- ✅ Usar Gherkin syntax para especificación de comportamiento
- ✅ Mínimo 80% de cobertura de código
- ✅ Pruebas en carpeta `tests/` siguiendo estructura del `src/`

---

## 📦 Convenciones Backend

### Estructura de Carpetas

```
backend/
├── src/
│   ├── config/
│   │   ├── environment.js       # Variables de entorno
│   │   ├── security.config.js   # Helmet, CORS, CSP
│   │   ├── socket.config.js     # Socket.IO config
│   │   └── auth0.config.js      # Auth0 config
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── chat.controller.js
│   │   └── health.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── sanitization.middleware.js
│   │   └── errorHandler.middleware.js
│   │
│   ├── services/
│   │   ├── security.service.js
│   │   ├── message.service.js
│   │   ├── user.service.js
│   │   └── logger.service.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.routes.js
│   │   ├── chat.routes.js
│   │   └── health.routes.js
│   │
│   ├── sockets/
│   │   ├── chat.handler.js
│   │   └── auth.handler.js
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   ├── sanitizers.js
│   │   └── constants.js
│   │
│   └── app.js
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   ├── utils/
│   │   └── middlewares/
│   ├── integration/
│   │   ├── auth.integration.test.js
│   │   └── chat.integration.test.js
│   └── setup.js
│
└── server.js                   # Entry point
```

### Convenciones de Nombres

#### Variables y Funciones
```javascript
// ✅ Correcto - camelCase, nombres descriptivos
const getUserById = (userId) => { /* ... */ }
const isValidEmail = (email) => { /* ... */ }
const rateLimitWindow = 15 * 60 * 1000
const maxLoginAttempts = 5

// ❌ Incorrecto
const getUserByID = () => { /* ... */ }
const isvalidemail = () => { /* ... */ }
const x = 15
const func = () => { /* ... */ }
```

#### Constantes
```javascript
// ✅ Correcto - UPPER_SNAKE_CASE
const MAX_REQUEST_SIZE = 1024 * 1024 // 1MB
const RATE_LIMIT_WINDOW = 15 * 60 * 1000
const ALLOWED_ORIGINS = ['http://localhost:3000']

// ❌ Incorrecto
const maxRequestSize = 1024
const max_request_size = 1024
```

#### Clases y Servicios
```javascript
// ✅ Correcto - PascalCase
class MessageService {
  send() { /* ... */ }
  retrieve() { /* ... */ }
}

// ❌ Incorrecto
class messageService { /* ... */ }
class message_service { /* ... */ }
```

### Estructura de Controladores

```javascript
// ✅ Ejemplo de controller bien estructurado
class AuthController {
  constructor(authService, logger) {
    this.authService = authService
    this.logger = logger
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const result = await this.authService.authenticate(email, password)
      
      res.status(200).json({
        success: true,
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const { userId } = req.user
      await this.authService.invalidateSession(userId)
      
      res.status(200).json({ success: true })
    } catch (error) {
      next(error)
    }
  }
}
```

### Estructura de Servicios

```javascript
// ✅ Ejemplo de service bien estructurado
class UserService {
  constructor(securityService, logger) {
    this.securityService = securityService
    this.logger = logger
  }

  async getUserById(userId) {
    const sanitizedId = this.securityService.validateUserId(userId)
    const user = await this.fetchUserFromDb(sanitizedId)
    
    if (!user) {
      throw new NotFoundError('User not found')
    }
    
    return this.maskSensitiveData(user)
  }

  fetchUserFromDb(userId) {
    // Implementación
  }

  maskSensitiveData(user) {
    // Remover datos sensibles antes de retornar
    const { passwordHash, ...safeUser } = user
    return safeUser
  }
}
```

### Endpoints Claros

```javascript
// ✅ Ejemplo de rutas claras y semánticas
router.post('/auth/login', 
  validationMiddleware(loginSchema),
  sanitizationMiddleware(),
  asyncHandler(authController.login.bind(authController))
)

router.post('/auth/logout',
  authMiddleware,
  asyncHandler(authController.logout.bind(authController))
)

router.get('/users/:userId',
  authMiddleware,
  validationMiddleware(getUserSchema),
  asyncHandler(userController.getById.bind(userController))
)

router.post('/chat/messages',
  authMiddleware,
  rateLimitMiddleware({ window: 60000, max: 30 }),
  validationMiddleware(messageSchema),
  sanitizationMiddleware(),
  asyncHandler(chatController.sendMessage.bind(chatController))
)

router.get('/health',
  asyncHandler(healthController.check.bind(healthController))
)
```

### Error Handling

```javascript
// ✅ Clase base de errores personalizada
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.timestamp = new Date()
    Error.captureStackTrace(this, this.constructor)
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        timestamp: err.timestamp,
      },
    })
  }

  // Error desconocido - no exponer detalles
  logger.error(err)
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  })
}
```

### Testing en Backend

```javascript
// ✅ Ejemplo de test con BDD (Jest + Given-When-Then)
describe('UserService', () => {
  let userService
  let mockSecurityService
  let mockLogger

  beforeEach(() => {
    mockSecurityService = {
      validateUserId: jest.fn((id) => id),
    }
    mockLogger = {
      error: jest.fn(),
    }
    userService = new UserService(mockSecurityService, mockLogger)
  })

  describe('getUserById', () => {
    it('should return user when valid id is provided', async () => {
      // Given
      const userId = 'user123'
      const expectedUser = { id: userId, email: 'user@test.com' }
      jest.spyOn(userService, 'fetchUserFromDb').mockResolvedValue(expectedUser)

      // When
      const result = await userService.getUserById(userId)

      // Then
      expect(result).toEqual(expectedUser)
      expect(mockSecurityService.validateUserId).toHaveBeenCalledWith(userId)
    })

    it('should throw NotFoundError when user does not exist', async () => {
      // Given
      const userId = 'nonexistent'
      jest.spyOn(userService, 'fetchUserFromDb').mockResolvedValue(null)

      // When & Then
      await expect(userService.getUserById(userId))
        .rejects
        .toThrow(NotFoundError)
    })
  })
})
```

---

## 🎨 Convenciones Frontend

### Estructura de Carpetas

```
frontend/src/
├── assets/
│   ├── logo.svg
│   └── favicon.ico
│
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Logout.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── chat/
│   │   ├── ChatContainer.jsx
│   │   ├── MessageList.jsx
│   │   ├── Message.jsx
│   │   ├── MessageInput.jsx
│   │   └── UserList.jsx
│   │
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Loading.jsx
│   │   └── ErrorBoundary.jsx
│   │
│   └── layout/
│       ├── Header.jsx
│       ├── Footer.jsx
│       └── Sidebar.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useSocket.js
│   ├── useChat.js
│   └── useLocalStorage.js
│
├── context/
│   ├── AuthContext.jsx
│   ├── ChatContext.jsx
│   └── providers.jsx
│
├── services/
│   ├── api.service.js
│   ├── auth.service.js
│   ├── socket.service.js
│   └── security.service.js
│
├── utils/
│   ├── validators.js
│   ├── sanitizers.js
│   ├── constants.js
│   └── helpers.js
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Chat.jsx
│   └── NotFound.jsx
│
├── styles/
│   ├── global.css
│   └── tailwind.css
│
├── App.jsx
├── router.jsx
└── main.jsx
```

### Convenciones de Nombres - Frontend

#### Variables de Estado y Datos
```javascript
// ✅ Correcto - camelCase, prefijo descriptivo
const [currentUser, setCurrentUser] = useState(null)
const [chatMessages, setChatMessages] = useState([])
const [isLoadingMessages, setIsLoadingMessages] = useState(false)
const [userInputText, setUserInputText] = useState('')
const [activeConversationId, setActiveConversationId] = useState(null)

// ❌ Incorrecto
const [user, setUser] = useState(null)
const [msgs, setMsgs] = useState([])
const [loading, setLoading] = useState(false)
const [data, setData] = useState('')
```

#### Componentes React
```javascript
// ✅ Correcto - PascalCase, nombres descriptivos
function ChatContainer() { /* ... */ }
function MessageList({ messages }) { /* ... */ }
function ProtectedRoute({ children }) { /* ... */ }

// ❌ Incorrecto
function chatContainer() { /* ... */ }
function message_list() { /* ... */ }
function route() { /* ... */ }
```

#### Hooks Personalizados
```javascript
// ✅ Correcto - use prefix, camelCase
function useAuth() { /* ... */ }
function useChat() { /* ... */ }
function useLocalStorage(key) { /* ... */ }

// ❌ Incorrecto
function authHook() { /* ... */ }
function fetchChat() { /* ... */ }
```

#### Constantes
```javascript
// ✅ Correcto
const API_BASE_URL = 'http://localhost:5000/api'
const MAX_MESSAGE_LENGTH = 5000
const SOCKET_RECONNECT_DELAY = 3000
const AUTH_TOKEN_KEY = 'auth_token'
const MESSAGES_PER_PAGE = 50

// ❌ Incorrecto
const apiUrl = 'http://localhost:5000/api'
const msgLen = 5000
```

### Componentes Bien Estructurados

```javascript
// ✅ Ejemplo de componente funcional con lógica clara
import { useState, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'

function ChatContainer() {
  const { user, isAuthenticated } = useAuth()
  const { messages, sendMessage, isLoading } = useChat()
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return

    try {
      await sendMessage(inputValue)
      setInputValue('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [inputValue, sendMessage])

  if (!isAuthenticated) {
    return <div>Please log in to chat</div>
  }

  return (
    <div className="chat-container">
      <MessageList messages={messages} currentUser={user} isLoading={isLoading} />
      <MessageInput 
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  )
}

export default ChatContainer
```

### Hooks Personalizados - Separación de Lógica

```javascript
// ✅ useChat.js - Lógica de chat separada
import { useState, useCallback, useEffect } from 'react'
import { socketService } from '../services/socket.service'
import { messageService } from '../services/message.service'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message])
    }

    socketService.on('message:received', handleNewMessage)
    return () => socketService.off('message:received', handleNewMessage)
  }, [])

  const sendMessage = useCallback(async (content) => {
    setIsLoading(true)
    setError(null)

    try {
      const newMessage = await messageService.create(content)
      socketService.emit('message:send', newMessage)
      return newMessage
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadMessages = useCallback(async (conversationId) => {
    setIsLoading(true)
    try {
      const loadedMessages = await messageService.getByConversation(conversationId)
      setMessages(loadedMessages)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { messages, isLoading, error, sendMessage, loadMessages }
}
```

```javascript
// ✅ useAuth.js - Lógica de autenticación separada
import { useState, useCallback, useEffect } from 'react'
import { authService } from '../services/auth.service'
import { useLocalStorage } from './useLocalStorage'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useLocalStorage('auth_token', null)

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const userData = await authService.verifyToken(token)
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          setToken(null)
          setIsAuthenticated(false)
        }
      }
      setIsLoading(false)
    }

    verifyToken()
  }, [token, setToken])

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    try {
      const response = await authService.login(email, password)
      setToken(response.token)
      setUser(response.user)
      setIsAuthenticated(true)
    } finally {
      setIsLoading(false)
    }
  }, [setToken])

  const logout = useCallback(async () => {
    await authService.logout()
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }, [setToken])

  return { user, isAuthenticated, isLoading, login, logout, token }
}
```

### Context y Providers

```javascript
// ✅ AuthContext.jsx - Estado global de autenticación
import { createContext, useContext } from 'react'
import { useAuth } from '../hooks/useAuth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
```

```javascript
// ✅ providers.jsx - Composición de providers
import { AuthProvider } from './AuthContext'
import { ChatProvider } from './ChatContext'

export function RootProvider({ children }) {
  return (
    <AuthProvider>
      <ChatProvider>
        {children}
      </ChatProvider>
    </AuthProvider>
  )
}
```

### Services - Separación de Preocupaciones

```javascript
// ✅ api.service.js - Configuración HTTP centralizada
import axios from 'axios'
import { getAuthToken } from '../utils/storage'

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Manejar expiración de token
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export { apiClient }
```

```javascript
// ✅ socket.service.js - Lógica de WebSocket
import io from 'socket.io-client'

class SocketService {
  constructor(url) {
    this.url = url
    this.socket = null
    this.listeners = new Map()
  }

  connect(token) {
    this.socket = io(this.url, {
      auth: { token },
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    this.socket.on('connect', () => {
      console.log('Socket connected')
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
    this.socket?.on(event, callback)
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
    this.socket?.off(event, callback)
  }

  disconnect() {
    this.socket?.disconnect()
    this.listeners.clear()
  }
}

export const socketService = new SocketService(
  process.env.VITE_SOCKET_URL || 'http://localhost:5000'
)
```

### Testing Frontend - Test-First Approach

```javascript
// ✅ Escribir test ANTES que el componente
describe('MessageInput', () => {
  it('should render input field and send button', () => {
    const { getByPlaceholderText, getByText } = render(
      <MessageInput onChange={() => {}} onSend={() => {}} value="" />
    )

    expect(getByPlaceholderText('Type a message...')).toBeInTheDocument()
    expect(getByText('Send')).toBeInTheDocument()
  })

  it('should call onSend when send button is clicked with non-empty value', () => {
    const handleSend = jest.fn()
    const { getByText } = render(
      <MessageInput 
        onChange={() => {}} 
        onSend={handleSend} 
        value="Hello" 
      />
    )

    fireEvent.click(getByText('Send'))
    expect(handleSend).toHaveBeenCalled()
  })

  it('should not call onSend when value is empty', () => {
    const handleSend = jest.fn()
    const { getByText } = render(
      <MessageInput 
        onChange={() => {}} 
        onSend={handleSend} 
        value="" 
      />
    )

    fireEvent.click(getByText('Send'))
    expect(handleSend).not.toHaveBeenCalled()
  })
})
```

---

## 🔒 Estándares de Seguridad

### Backend - Seguridad Obligatoria

#### 1. Validación de Entrada
```javascript
// ✅ Validar todos los inputs
const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3).max(50),
})

const validateUserInput = (data) => {
  try {
    return userSchema.parse(data)
  } catch (error) {
    throw new ValidationError(error.message)
  }
}
```

#### 2. Sanitización de Datos
```javascript
// ✅ Sanitizar antes de guardar/retornar
import xss from 'xss'
import DOMPurify from 'isomorphic-dompurify'

const sanitizeUserInput = (input) => {
  return xss(input, {
    whiteList: {},
    stripIgnoredTag: true,
  })
}

const sanitizeHtmlContent = (html) => {
  return DOMPurify.sanitize(html, { 
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'] 
  })
}
```

#### 3. Rate Limiting
```javascript
// ✅ Prevenir brute force attacks
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // máximo 100 requests
})

router.post('/auth/login', loginLimiter, authController.login)
router.use('/api/', apiLimiter)
```

#### 4. CORS Seguro
```javascript
// ✅ Configurar CORS restrictivo
const cors = require('cors')

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 horas
}

app.use(cors(corsOptions))
```

#### 5. Helmet - Seguridad en Headers
```javascript
// ✅ Proteger contra ataques comunes
const helmet = require('helmet')

app.use(helmet())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
  },
}))
```

#### 6. JWT Seguro
```javascript
// ✅ Usar JWT con expiración corta
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      expiresIn: '15m', // Token expira en 15 minutos
      algorithms: ['HS256'],
    })
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token')
  }
}
```

#### 7. Logging y Monitoreo
```javascript
// ✅ Registrar eventos de seguridad
const logger = require('./logger.service')

logger.warn(`Login attempt failed for user: ${email}`)
logger.error(`Unauthorized access attempt: ${error.message}`)
logger.info(`User ${userId} successfully authenticated`)
```

### Frontend - Seguridad Obligatoria

#### 1. Sanitización de Contenido
```javascript
// ✅ Sanitizar antes de renderizar
import DOMPurify from 'dompurify'

function Message({ content, author }) {
  const sanitizedContent = DOMPurify.sanitize(content)
  return (
    <div className="message">
      <strong>{author}</strong>
      <p dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  )
}
```

#### 2. Almacenamiento Seguro de Tokens
```javascript
// ✅ NO guardar en localStorage (usar sessionStorage o memory)
const storeAuthToken = (token) => {
  // Opción 1: sessionStorage (se limpia al cerrar navegador)
  sessionStorage.setItem('auth_token', token)

  // Opción 2: Memory (más seguro, se pierde al recargar)
  // En un estado global o variable
}

// ❌ NUNCA esto
localStorage.setItem('auth_token', token)
```

#### 3. Validación de URLs
```javascript
// ✅ Validar URLs antes de redirigir
const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

const redirectToUrl = (url) => {
  if (isValidUrl(url)) {
    window.location.href = url
  }
}
```

#### 4. Content Security Policy (CSP)
```javascript
// ✅ En vite.config.js
export default {
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
    },
  },
}
```

---

## 🔄 Flujo de Desarrollo

### Paso 1: Crear Pruebas (Test-First)
```bash
1. Crear archivo de test en tests/unit/ o tests/integration/
2. Escribir casos de prueba usando BDD (Given-When-Then)
3. Las pruebas deben fallar (Red phase)
```

### Paso 2: Implementar Funcionalidad
```bash
1. Escribir código mínimo para pasar las pruebas
2. Seguir las convenciones de nombres
3. Aplicar principios SOLID
4. Green phase: Todas las pruebas pasan
```

### Paso 3: Refactorización
```bash
1. Mejorar legibilidad del código
2. Reducir duplication
3. Asegurar que las pruebas sigan pasando
4. Blue phase: Código limpio y funcional
```

### Paso 4: Validación de Seguridad
```bash
1. Ejecutar linter (ESLint)
2. Ejecutar tests (cobertura mínima 80%)
3. Ejecutar build del proyecto
4. Revisar secrets con secretlint
```

### Paso 5: Commit y Push
```bash
1. Commit: "[tipo]: descripción" (ej: feat: add user authentication")
2. Push a rama feature
3. Crear Pull Request
```

---

## ✅ Checklist de Calidad

### Antes de cada Commit

- [ ] **Convenciones de Nombres**
  - [ ] Variables/funciones en camelCase
  - [ ] Constantes en UPPER_SNAKE_CASE
  - [ ] Clases en PascalCase
  - [ ] Nombres descriptivos y en inglés

- [ ] **Seguridad**
  - [ ] Entrada validada (schema validation)
  - [ ] Salida sanitizada (XSS prevention)
  - [ ] No hardcodear secrets
  - [ ] Rate limiting en endpoints sensibles
  - [ ] Logs de eventos de seguridad

- [ ] **Testing**
  - [ ] Mínimo 80% de cobertura
  - [ ] Tests green (todas pasan)
  - [ ] BDD syntax en tests
  - [ ] Test-first approach

- [ ] **Linting y Formato**
  - [ ] `npm run lint` - Sin errores
  - [ ] `npm run format` - Código formateado
  - [ ] ESLint rules personalizado

- [ ] **Build y Build Test**
  - [ ] `npm run build` - Sin errores de compilación
  - [ ] `npm test` - Todos los tests pasan
  - [ ] `npm run lint` - Sin advertencias/errores

- [ ] **SOLID Principles**
  - [ ] Single Responsibility - Una razón para cambiar
  - [ ] Open/Closed - Extendible, no modificable
  - [ ] Liskov Substitution - Sustitución segura
  - [ ] Interface Segregation - Interfaces específicas
  - [ ] Dependency Inversion - Inyección de dependencias

- [ ] **Código Limpio**
  - [ ] Máximo 50 líneas por función
  - [ ] Máximo 3 niveles de anidamiento
  - [ ] Sin comentarios innecesarios (código autodocumentado)
  - [ ] Sin emojis
  - [ ] Sin código muerto

- [ ] **Documentación**
  - [ ] README actualizado
  - [ ] Cambios significativos documentados
  - [ ] Tipos TypeScript/JSDoc (opcional pero recomendado)

### Antes de Push

- [ ] Rebasar con main: `git rebase origin/main`
- [ ] Resolver conflictos si existen
- [ ] Ejecutar tests nuevamente
- [ ] Ejecutar build nuevamente

---

## 📊 Estructura de Commit

```
[tipo]: descripción breve

[cuerpo opcional con más detalle]

[footer opcional: fixes #123, relates to #456]

# Tipos permitidos:
# feat:     Nueva característica
# fix:      Corrección de bug
# docs:     Cambios en documentación
# style:    Cambios en formato (no afectan lógica)
# refactor: Refactorización de código
# perf:     Mejoras de performance
# test:     Añadir o modificar tests
# chore:    Cambios en dependencias, config, etc.

Ejemplo:
feat: implement user authentication with JWT

- Add login and logout endpoints
- Implement JWT token generation and validation
- Add rate limiting for login attempts
- Add authentication middleware

fixes #42
```

---

## 🚀 Stack Recomendado

### Backend
- **Framework:** Express.js
- **Runtime:** Node.js 18+
- **Autenticación:** Auth0 + JWT
- **Validación:** Zod o Joi
- **Logger:** Winston o Pino
- **Testing:** Jest + Supertest
- **Linting:** ESLint + Prettier
- **Security:** Helmet, express-rate-limit, xss

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **State Management:** TanStack Query + Context API
- **Forms:** React Hook Form + Zod
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint + Prettier
- **WebSocket:** Socket.IO Client

---

## 📝 Notas Finales

1. **Consistencia:** Mantener las convenciones en TODOS los archivos
2. **Calidad:** No sacrificar calidad por velocidad
3. **Seguridad:** Aplicar security-first mindset en cada decisión
4. **Testing:** Escribir tests antes que el código
5. **Documentación:** Mantener README y AGENTS.MD actualizados

---

**Última actualización:** Octubre 2025  
**Versión:** 1.0
