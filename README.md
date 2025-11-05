# 🔒 UNA Chat - Full Stack Secure Chat Application

[![Security-First](https://img.shields.io/badge/approach-security%20first-brightgreen)](./AGENTS.MD)
[![SOLID Principles](https://img.shields.io/badge/architecture-SOLID-blue)](./AGENTS.MD)
[![Test-First Development](https://img.shields.io/badge/methodology-TDD%2FBDD-yellow)](./AGENTS.MD)
[![Auth0](https://img.shields.io/badge/auth-Auth0-orange)](https://auth0.com)

Aplicación de chat en tiempo real con autenticación Auth0, validación y sanitización siguiendo **SSDLC (Secure Software Development Lifecycle)**.

---

## 🚀 Quick Start

### Requisitos Previos

- Node.js 18+
- npm o yarn
- Git
- Cuenta de Auth0 (gratuita en https://auth0.com)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/BrandonJafeth/una-chat.git
cd una-chat

# Instalar dependencias

npm install      tseslint.configs.recommendedTypeChecked,

      // Alternatively, use this for stricter rules

# Configurar variables de entorno      tseslint.configs.strictTypeChecked,

cp .env.example .env      // Optionally, add this for stylistic rules

      tseslint.configs.stylisticTypeChecked,

# Ejecutar en modo desarrollo

npm run dev      // Other configs...

```    ],

    languageOptions: {

### Access Points      parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],npm install

# Configurar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales de Auth0
# VITE_AUTH0_DOMAIN=tu-dominio.auth0.com
# VITE_AUTH0_CLIENT_ID=tu-client-id
# VITE_AUTH0_AUDIENCE=https://una-chat-api
```

### Configuración de Auth0

1. **Crear cuenta en Auth0** (https://auth0.com)
2. **Crear una aplicación:**
   - Tipo: Single Page Application
   - Nombre: UNA Chat
3. **Configurar URLs:**
   - Allowed Callback URLs: `http://localhost:5173/callback`
   - Allowed Logout URLs: `http://localhost:5173`
   - Allowed Web Origins: `http://localhost:5173`
4. **Copiar credenciales al archivo `.env`:**
   ```
   VITE_AUTH0_DOMAIN=dev-XXXXXXXX.us.auth0.com
   VITE_AUTH0_CLIENT_ID=XXXXXXXXXXXXXXXXXXX
   VITE_AUTH0_AUDIENCE=https://una-chat-api
   ```

### Ejecutar Aplicación

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview
```

**URLs por defecto:**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **API Docs:** http://localhost:5000/api-docs

---

## 📚 Arquitectura del Proyecto

### Frontend (React + Vite + TypeScript)

```
src/
├── components/
│   ├── auth/             # Auth0 login/protected routes
│   ├── common/           # Componentes reutilizables
│   ├── chat/             # Componentes de chat
│   └── layout/           # Layout components
│
├── hooks/                # Custom React hooks
├── services/             # API y servicios
├── utils/                # Utilidades

├── App.tsx              # Componente principal      // Other configs...

└── main.tsx             # Entry point      // Enable lint rules for React

```      reactX.configs['recommended-typescript'],

      // Enable lint rules for React DOM

---      reactDom.configs.recommended,

    ],

## 🛡️ Características de Seguridad    languageOptions: {

      parserOptions: {

### Frontend        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- ✅ XSS Protection (DOMPurify)        tsconfigRootDir: import.meta.dirname,

- ✅ sessionStorage (no localStorage)      },

- ✅ URL Validation      // other options...

- ✅ Content Security Policy    },

- ✅ Input Validation (Zod)  },

])

### Backend```

- ✅ Helmet Security Headers
- ✅ CORS Restrictivo
- ✅ Rate Limiting
- ✅ JWT Authentication
- ✅ Logging de Eventos

---

## 📦 Tech Stack

**Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Socket.IO Client, Axios, Zod, DOMPurify  
**Backend:** Node.js, Express, Socket.IO, TypeScript, Helmet, Winston

---

## 📋 Comandos

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run lint         # Linting
npm test             # Tests
```

---

## 📄 Licencia

MIT - Universidad Nacional de Costa Rica

---

**Última actualización:** Octubre 2025
