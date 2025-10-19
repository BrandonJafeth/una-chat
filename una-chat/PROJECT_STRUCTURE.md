# 📁 Estructura del Proyecto UNA Chat

```
una-chat/
│
├── public/                      # Archivos estáticos públicos
│   └── vite.svg
│
├── src/
│   ├── components/
│   │   ├── common/             # ✅ Componentes reutilizables
│   │   │   ├── Button.tsx      # Botón con variants (primary, secondary, danger, ghost)
│   │   │   ├── Input.tsx       # Input con label, error y helper text
│   │   │   ├── Loading.tsx     # Spinner de carga con tamaños configurables
│   │   │   └── ErrorBoundary.tsx # Manejo de errores React
│   │   │
│   │   ├── chat/               # ✅ Componentes de chat
│   │   │   ├── ChatContainer.tsx   # Contenedor principal del chat
│   │   │   ├── MessageList.tsx     # Lista de mensajes con scroll automático
│   │   │   ├── Message.tsx         # Componente individual de mensaje
│   │   │   └── MessageInput.tsx    # Input de mensajes con contador
│   │   │
│   │   └── layout/             # ✅ Componentes de layout
│   │       ├── Header.tsx      # Header con logo, estado y logout
│   │       └── Footer.tsx      # Footer con info del proyecto
│   │
│   ├── hooks/                  # ✅ Custom React Hooks
│   │   ├── useChat.ts          # Lógica de mensajería y WebSocket
│   │   ├── useSocket.ts        # Gestión de conexión Socket.IO
│   │   └── useLocalStorage.ts # Persistencia en sessionStorage
│   │
│   ├── services/               # ✅ Servicios de comunicación
│   │   ├── api.service.ts      # Cliente HTTP con Axios + interceptors
│   │   ├── socket.service.ts   # Cliente WebSocket con Socket.IO
│   │   └── security.service.ts # Sanitización con DOMPurify
│   │
│   ├── utils/                  # ✅ Utilidades y helpers
│   │   ├── constants.ts        # Constantes globales (UPPER_SNAKE_CASE)
│   │   ├── validators.ts       # Validaciones con Zod
│   │   ├── sanitizers.ts       # Funciones de sanitización
│   │   └── helpers.ts          # Funciones auxiliares (formatTimestamp, debounce, etc.)
│   │
│   ├── App.tsx                 # ✅ Componente raíz de la aplicación
│   ├── main.tsx                # ✅ Entry point de React
│   └── index.css               # ✅ Estilos globales + Tailwind
│
├── .env                        # Variables de entorno (NO COMMITEAR)
├── .env.example                # Ejemplo de variables de entorno
├── .gitignore                  # Archivos ignorados por Git
├── eslint.config.js            # Configuración de ESLint
├── index.html                  # HTML principal
├── package.json                # Dependencias y scripts npm
├── tsconfig.json               # Configuración de TypeScript
├── tsconfig.app.json           # Config TS específica de la app
├── tsconfig.node.json          # Config TS para Node
├── vite.config.ts              # Configuración de Vite
│
├── AGENTS.MD                   # ✅ Especificaciones completas (IMPORTANTE)
├── README.md                   # ✅ Documentación principal
└── USAGE.md                    # ✅ Guía de uso para usuarios
```

---

## 🎯 Principios de Organización

### Separación por Responsabilidad

#### 1. **Components** - Presentación
- `common/`: Componentes reutilizables sin lógica de negocio
- `chat/`: Componentes específicos del chat
- `layout/`: Estructura de la página

#### 2. **Hooks** - Lógica Reutilizable
- Custom hooks siguiendo el patrón `use*`
- Encapsulan state management y side effects
- Reutilizables en múltiples componentes

#### 3. **Services** - Comunicación Externa
- API REST (HTTP)
- WebSocket (Socket.IO)
- Seguridad y sanitización

#### 4. **Utils** - Funciones Auxiliares
- Validadores
- Sanitizadores
- Helpers generales
- Constantes

---

## 📋 Convenciones de Nombres

### Archivos
```
✅ Button.tsx          (Componentes: PascalCase)
✅ useChat.ts          (Hooks: camelCase con 'use')
✅ api.service.ts      (Services: camelCase + .service)
✅ constants.ts        (Utils: lowercase)
```

### Variables y Funciones
```typescript
// ✅ Variables: camelCase
const userName = 'John'
const messageCount = 10

// ✅ Constantes: UPPER_SNAKE_CASE
const MAX_MESSAGE_LENGTH = 5000
const API_BASE_URL = 'http://localhost:5000'

// ✅ Funciones: camelCase
function getUserById(id: string) { }
const sendMessage = (text: string) => { }

// ✅ Componentes: PascalCase
function ChatContainer() { }
function MessageList() { }

// ✅ Hooks: use prefix + camelCase
function useChat() { }
function useLocalStorage() { }

// ✅ Tipos/Interfaces: PascalCase
interface ChatMessage { }
type MessageProps = { }
```

---

## 🔒 Seguridad en Cada Capa

### Componentes
- Sanitización antes de renderizar con `dangerouslySetInnerHTML`
- Validación de props
- Error boundaries

### Hooks
- Validación de datos antes de enviar
- Manejo de errores
- Limpieza de subscripciones

### Services
- Interceptors de Axios para tokens
- Validación de URLs
- Rate limiting awareness
- Sanitización de entrada/salida

### Utils
- Schemas de validación con Zod
- Funciones de sanitización con DOMPurify
- Validadores de URLs y formatos

---

## 🎨 Estilos y Diseño

### Tailwind CSS v4
- Utility-first CSS framework
- Responsive design por defecto
- Custom animations en `index.css`

### Paleta de Colores
```css
/* Primarios */
blue-600    → Botones principales
blue-50     → Backgrounds suaves

/* Estados */
green-500   → Conectado
red-500     → Desconectado
yellow-600  → Advertencias

/* Neutral */
gray-*      → Texto y backgrounds
```

---

## 📦 Dependencias Principales

### Producción
```json
{
  "react": "^18.3.1",
  "socket.io-client": "^4.8.1",
  "axios": "^1.7.9",
  "dompurify": "^3.2.3",
  "zod": "^3.24.1",
  "clsx": "^2.1.1"
}
```

### Desarrollo
```json
{
  "@vitejs/plugin-react-swc": "^4.1.0",
  "vite": "^7.1.10",
  "typescript": "~5.6.2",
  "tailwindcss": "^4.0.0",
  "eslint": "^9.17.0"
}
```

---

## 🚀 Flujo de Datos

```
User Input
    ↓
MessageInput Component
    ↓
ChatContainer (validation)
    ↓
useChat Hook
    ↓
socketService (sanitization)
    ↓
Backend WebSocket
    ↓
Broadcast to all clients
    ↓
socketService receives
    ↓
useChat Hook (sanitization)
    ↓
State update
    ↓
MessageList Component
    ↓
Message Component (render)
```

---

## ✅ Checklist de Archivos

### Core Application
- [x] App.tsx
- [x] main.tsx
- [x] index.css

### Components
- [x] Button.tsx
- [x] Input.tsx
- [x] Loading.tsx
- [x] ErrorBoundary.tsx
- [x] ChatContainer.tsx
- [x] MessageList.tsx
- [x] Message.tsx
- [x] MessageInput.tsx
- [x] Header.tsx
- [x] Footer.tsx

### Hooks
- [x] useChat.ts
- [x] useSocket.ts
- [x] useLocalStorage.ts

### Services
- [x] api.service.ts
- [x] socket.service.ts
- [x] security.service.ts

### Utils
- [x] constants.ts
- [x] validators.ts
- [x] sanitizers.ts
- [x] helpers.ts

### Documentation
- [x] README.md
- [x] AGENTS.MD
- [x] USAGE.md
- [x] PROJECT_STRUCTURE.md (este archivo)

---

## 🎓 Notas para Desarrolladores

1. **Siempre sanitizar** entrada/salida de datos
2. **Validar con Zod** antes de enviar al backend
3. **Componentes pequeños** (máx 50 líneas preferible)
4. **Hooks reutilizables** para lógica compartida
5. **Tipos TypeScript** para todo
6. **Nombres descriptivos** en inglés
7. **Comentarios solo si necesario** (código autodocumentado)
8. **Tests antes de código** (TDD)

---

**Última actualización:** Octubre 2025
