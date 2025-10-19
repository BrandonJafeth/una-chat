# 🔐 Auth0 Integration Guide

## Overview

UNA Chat utiliza Auth0 como proveedor de autenticación para garantizar seguridad de nivel empresarial en la aplicación de chat en tiempo real.

---

## 🚀 Quick Setup

### 1. Crear cuenta de Auth0

1. Ve a [https://auth0.com](https://auth0.com)
2. Haz clic en **Sign Up** (registro gratuito)
3. Verifica tu correo electrónico

### 2. Crear una aplicación en Auth0

1. En el dashboard de Auth0, ve a **Applications** > **Applications**
2. Haz clic en **Create Application**
3. Configura:
   - **Name:** UNA Chat
   - **Application Type:** Single Page Application
   - Haz clic en **Create**

### 3. Configurar URLs de la aplicación

En la pestaña **Settings** de tu aplicación:

**Allowed Callback URLs:**
```
http://localhost:5173/callback, http://localhost:3000/callback
```

**Allowed Logout URLs:**
```
http://localhost:5173, http://localhost:3000
```

**Allowed Web Origins:**
```
http://localhost:5173, http://localhost:3000
```

**Allowed Origins (CORS):**
```
http://localhost:5173, http://localhost:3000
```

Haz clic en **Save Changes**.

### 4. Crear API en Auth0

1. Ve a **Applications** > **APIs**
2. Haz clic en **Create API**
3. Configura:
   - **Name:** UNA Chat API
   - **Identifier:** `https://una-chat-api`
   - **Signing Algorithm:** RS256
4. Haz clic en **Create**

### 5. Configurar variables de entorno

Copia las credenciales de tu aplicación:

**Frontend (.env):**
```bash
VITE_AUTH0_DOMAIN=dev-XXXXXXXX.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-from-dashboard
VITE_AUTH0_AUDIENCE=https://una-chat-api
VITE_AUTH0_REDIRECT_URI=http://localhost:5173/callback
```

**Backend (.env):**
```bash
AUTH0_DOMAIN=dev-XXXXXXXX.us.auth0.com
AUTH0_AUDIENCE=https://una-chat-api
AUTH0_ISSUER=https://dev-XXXXXXXX.us.auth0.com/
```

---

## 🏗️ Arquitectura de Autenticación

### Flujo de Login

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Auth0
    participant Backend

    User->>Frontend: Click "Login with Auth0"
    Frontend->>Auth0: Redirect to Auth0 Login
    Auth0->>User: Show Login Form
    User->>Auth0: Enter credentials
    Auth0->>Frontend: Redirect with authorization code
    Frontend->>Auth0: Exchange code for tokens
    Auth0->>Frontend: Return access_token & id_token
    Frontend->>Backend: API Request + Bearer token
    Backend->>Auth0: Verify token signature
    Auth0->>Backend: Token valid
    Backend->>Frontend: Protected resource
```

### Componentes de Auth0

#### 1. Auth0Provider (main.tsx)
```typescript
<Auth0Provider
  domain={AUTH0_DOMAIN}
  clientId={AUTH0_CLIENT_ID}
  authorizationParams={{
    redirect_uri: AUTH0_REDIRECT_URI,
    audience: AUTH0_AUDIENCE,
  }}
  useRefreshTokens
  cacheLocation="localstorage"
>
  <App />
</Auth0Provider>
```

**Configuración:**
- `useRefreshTokens`: Permite renovar tokens automáticamente
- `cacheLocation="localstorage"`: Persiste sesión entre recargas

#### 2. useAuth0Token Hook
```typescript
const { token, error, isLoading } = useAuth0Token()
```

**Funcionalidad:**
- Obtiene el access token silenciosamente
- Actualiza el token cuando el usuario se autentica
- Maneja errores de token expirado

#### 3. ProtectedRoute Component
```typescript
<ProtectedRoute>
  <ChatContainer />
</ProtectedRoute>
```

**Funcionalidad:**
- Verifica si el usuario está autenticado
- Redirige a Login si no está autenticado
- Muestra Loading mientras verifica token

#### 4. API Service Integration
```typescript
apiService.setToken(token) // Inyecta token en headers
```

**Headers enviados:**
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 5. Socket.IO Integration
```typescript
socketService.connect(token) // Token en handshake
```

**Auth config:**
```javascript
{
  auth: { token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...' }
}
```

---

## 🔒 Características de Seguridad

### Token Management

✅ **Access Token:**
- Duración: 15 minutos (configurable)
- Formato: JWT (JSON Web Token)
- Algoritmo: RS256
- Uso: Autenticación en API y WebSocket

✅ **Refresh Token:**
- Duración: 7 días (configurable)
- Almacenamiento: localStorage (cifrado)
- Uso: Renovar access token automáticamente

✅ **ID Token:**
- Contiene información del usuario
- No se usa para autenticación de API
- Solo para mostrar datos del perfil

### Validación Backend

El backend valida tokens con `express-oauth2-jwt-bearer`:

```javascript
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256',
})

app.use('/api/chat', checkJwt, chatRoutes)
```

**Validaciones:**
- ✅ Firma del token (RS256)
- ✅ Expiración (`exp` claim)
- ✅ Issuer correcto (`iss` claim)
- ✅ Audience correcto (`aud` claim)

---

## 🧪 Testing Auth0 Integration

### Test Manual

1. **Iniciar aplicación:**
   ```bash
   npm run dev
   ```

2. **Abrir navegador:** http://localhost:5173

3. **Verificar redirect a Auth0:**
   - Deberías ver la pantalla de login de Auth0
   - URL debe ser: `https://dev-XXXX.us.auth0.com/authorize?...`

4. **Login:**
   - Ingresa credenciales de prueba
   - Después del login, deberías ser redirigido a `/callback`
   - Luego redirigido a la aplicación de chat

5. **Verificar token en Network:**
   - Abre DevTools > Network
   - Envía un mensaje
   - Verifica header: `Authorization: Bearer eyJ...`

### Errores Comunes

#### Error: "Invalid state"
**Causa:** Redirect URI no configurado correctamente en Auth0.

**Solución:**
- Ve a Auth0 Dashboard > Applications > Settings
- Verifica que `http://localhost:5173/callback` esté en Allowed Callback URLs

#### Error: "consent_required"
**Causa:** Audience no configurado correctamente.

**Solución:**
- Verifica que `VITE_AUTH0_AUDIENCE` coincida con el Identifier de tu API en Auth0

#### Error: "Failed to fetch"
**Causa:** CORS no configurado en Auth0.

**Solución:**
- Ve a Auth0 Dashboard > Applications > Settings
- Agrega `http://localhost:5173` en Allowed Web Origins

#### Error: "jwt malformed"
**Causa:** Token no se está enviando correctamente.

**Solución:**
- Verifica que `useAuth0Token` esté retornando el token
- Verifica que `apiService.setToken(token)` se esté llamando

---

## 📊 User Information

### Obtener datos del usuario

```typescript
const { user, isAuthenticated } = useAuth0()

if (isAuthenticated) {
  console.log('User:', user)
  // {
  //   email: "user@example.com",
  //   email_verified: true,
  //   name: "John Doe",
  //   nickname: "john",
  //   picture: "https://...",
  //   sub: "auth0|123456",
  //   updated_at: "2024-01-01T00:00:00.000Z"
  // }
}
```

### Usar en componentes

```typescript
const username = user?.name || user?.email || 'Anonymous'
const avatar = user?.picture || '/default-avatar.png'
```

---

## 🔐 Best Practices

### ✅ DO

- ✅ Usar `useRefreshTokens` para renovación automática
- ✅ Verificar tokens en el backend con Auth0
- ✅ Usar RS256 (algoritmo asimétrico)
- ✅ Configurar audience específico para tu API
- ✅ Manejar errores de token expirado
- ✅ Limpiar tokens al logout

### ❌ DON'T

- ❌ Almacenar tokens en cookies sin `httpOnly`
- ❌ Usar `sessionStorage` para refresh tokens
- ❌ Confiar en tokens sin verificar firma
- ❌ Exponer secrets en el frontend
- ❌ Permitir tokens sin expiración
- ❌ Usar HS256 en producción

---

## 🚀 Production Deployment

### Frontend

1. **Actualizar Allowed URLs en Auth0:**
   ```
   https://una-chat.tu-dominio.com/callback
   ```

2. **Configurar variables de entorno:**
   ```bash
   VITE_AUTH0_REDIRECT_URI=https://una-chat.tu-dominio.com/callback
   ```

3. **Build:**
   ```bash
   npm run build
   ```

### Backend

1. **Configurar Auth0 API:**
   - Asegúrate de que `AUTH0_ISSUER` incluya `https://`
   - Verifica que `AUTH0_AUDIENCE` coincida con el frontend

2. **Configurar Rate Limiting:**
   ```javascript
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutos
     max: 5, // máximo 5 intentos
   })
   ```

---

## 📚 Resources

- [Auth0 Documentation](https://auth0.com/docs)
- [Auth0 React SDK](https://github.com/auth0/auth0-react)
- [JWT.io - Decode JWT](https://jwt.io)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Última actualización:** Enero 2025  
**Versión:** 1.0
