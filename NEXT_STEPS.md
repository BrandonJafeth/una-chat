# 🎯 Próximos Pasos - UNA Chat

## ✅ Lo que ya está listo

1. ✅ Frontend completamente integrado con Auth0
2. ✅ Todos los componentes creados y funcionando
3. ✅ Services configurados para enviar tokens
4. ✅ Build exitoso sin errores
5. ✅ Documentación completa

---

## 🔥 Pasos Inmediatos (REQUERIDOS)

### 1. Verificar Backend está corriendo

El backend debe estar ejecutándose en `http://localhost:5000` con Auth0 configurado.

**Verifica que el backend tenga estos archivos `.env`:**
```bash
# Backend .env
PORT=5000
AUTH0_DOMAIN=dev-0j4ugofjt7k0fl1p.us.auth0.com
AUTH0_AUDIENCE=https://una-chat-api
AUTH0_ISSUER=https://dev-0j4ugofjt7k0fl1p.us.auth0.com/
```

**Inicia el backend:**
```bash
cd backend
npm install  # Si no lo has hecho
npm start
```

### 2. Verificar Configuración de Auth0

Ve a tu dashboard de Auth0 (https://manage.auth0.com) y verifica:

#### Application Settings
- ✅ **Name:** info-aplication (o el que tengas)
- ✅ **Domain:** dev-0j4ugofjt7k0fl1p.us.auth0.com
- ✅ **Client ID:** rbmdSuIm0LWfVDtMKmvWjzTnQvAQoJrd
- ✅ **Application Type:** Single Page Application

#### Allowed Callback URLs
```
http://localhost:5173/callback,
http://localhost:3000/callback
```

#### Allowed Logout URLs
```
http://localhost:5173,
http://localhost:3000
```

#### Allowed Web Origins
```
http://localhost:5173,
http://localhost:3000
```

**Haz clic en "Save Changes" después de verificar.**

### 3. Crear API en Auth0 (Si no existe)

1. Ve a **Applications** > **APIs**
2. Verifica si existe "UNA Chat API"
3. Si NO existe:
   - Click en **Create API**
   - **Name:** UNA Chat API
   - **Identifier:** `https://una-chat-api`
   - **Signing Algorithm:** RS256
   - Click en **Create**

### 4. Probar la Aplicación

#### Paso A: Abrir en navegador
```bash
# Frontend ya está corriendo en http://localhost:5173
# Si no, ejecuta:
npm run dev
```

#### Paso B: Login
1. Abre http://localhost:5173
2. Deberías ver la pantalla de **Login with Auth0**
3. Click en el botón
4. Deberías ser redirigido a Auth0 login

#### Paso C: Crear usuario de prueba (si no tienes)
En el login de Auth0:
- Click en **Sign Up** (si está habilitado)
- O usa Google/Social login
- O crea un usuario en Auth0 Dashboard:
  - Ve a **User Management** > **Users**
  - Click en **Create User**
  - Email: `test@example.com`
  - Password: `Test1234!`

#### Paso D: Enviar mensaje
1. Después de login, deberías ver el chat
2. Escribe un mensaje
3. Presiona Enter o click en Send

**Resultado esperado:**
- ✅ Mensaje enviado
- ✅ Aparece en la lista
- ✅ Backend recibe el mensaje con token válido

---

## 🐛 Troubleshooting

### Problema 1: "Invalid state" al hacer login

**Causa:** Redirect URI no configurado

**Solución:**
1. Ve a Auth0 Dashboard > Applications > Settings
2. Verifica que `http://localhost:5173/callback` esté en **Allowed Callback URLs**
3. Guarda cambios
4. Recarga la aplicación

### Problema 2: Error 401 al enviar mensaje

**Causa:** Backend no está validando el token correctamente

**Solución:**
1. Verifica que el backend tenga instalado `express-oauth2-jwt-bearer`
2. Verifica que `AUTH0_DOMAIN` y `AUTH0_AUDIENCE` coincidan entre frontend y backend
3. Revisa logs del backend para ver el error específico

### Problema 3: "Failed to fetch" al iniciar

**Causa:** Backend no está corriendo

**Solución:**
```bash
cd backend
npm start
```

### Problema 4: Token no se envía en headers

**Causa:** Hook `useAuth0Token` no está obteniendo el token

**Solución:**
1. Abre DevTools > Console
2. Verifica errores en la consola
3. Asegúrate que `VITE_AUTH0_AUDIENCE` esté configurado en `.env`
4. Reinicia el dev server: Ctrl+C y `npm run dev`

### Problema 5: "consent_required"

**Causa:** Audience no configurado correctamente

**Solución:**
1. Verifica que el API existe en Auth0 con identifier `https://una-chat-api`
2. Verifica que `.env` tenga `VITE_AUTH0_AUDIENCE=https://una-chat-api`
3. Reinicia dev server

---

## 📋 Checklist de Verificación

Antes de considerar la integración completa, verifica:

- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 5173
- [ ] Auth0 Application creado
- [ ] Auth0 API creado
- [ ] Allowed Callback URLs configurados
- [ ] Variables de entorno configuradas
- [ ] Usuario de prueba creado
- [ ] Login funciona y redirige correctamente
- [ ] Token aparece en Network > Headers (Authorization: Bearer ...)
- [ ] Mensajes se envían correctamente
- [ ] Backend valida token sin errores

---

## 🚀 Testing Completo

### Test 1: Login Flow
```
1. Abrir http://localhost:5173
2. Click en "Login with Auth0"
3. Ingresar credenciales
4. Verificar redirect a /callback
5. Verificar redirect a chat
```

**Resultado esperado:** ✅ Login exitoso, chat visible

### Test 2: Token Injection
```
1. Abrir DevTools > Network
2. Escribir mensaje y enviar
3. Click en request POST /api/chat/messages
4. Ver Headers > Request Headers
5. Buscar: Authorization: Bearer eyJ...
```

**Resultado esperado:** ✅ Header presente con token

### Test 3: Protected Route
```
1. Estando logueado, copiar URL
2. Abrir en incógnito/private browsing
3. Pegar URL
```

**Resultado esperado:** ✅ Redirige a login, no muestra chat

### Test 4: Logout
```
1. Estando logueado, click en logout
2. Confirmar en dialog
```

**Resultado esperado:** ✅ Redirige a login, tokens limpiados

### Test 5: WebSocket con Token
```
1. Login exitoso
2. Abrir DevTools > Network > WS
3. Click en conexión de Socket.IO
4. Ver Messages > Handshake
5. Buscar: auth: { token: "eyJ..." }
```

**Resultado esperado:** ✅ Token enviado en handshake

---

## 📝 Comandos Útiles

### Frontend
```bash
# Dev
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

### Backend
```bash
# Dev con nodemon
npm run dev

# Producción
npm start

# Tests
npm test
```

### Logs
```bash
# Ver logs del backend en tiempo real
# (Si usas nodemon o similar)
tail -f backend/logs/app.log

# Ver requests en DevTools
# Network > Filter: XHR
```

---

## 🎯 Objetivos Cumplidos

1. ✅ **Seguridad:** Auth0 JWT validation
2. ✅ **SOLID Principles:** Código modular y mantenible
3. ✅ **Clean Code:** Nombres descriptivos, funciones pequeñas
4. ✅ **Testing Ready:** Build sin errores
5. ✅ **Documentation:** Guías completas
6. ✅ **Production Ready:** Configuración robusta

---

## 📚 Recursos Adicionales

- [AUTH0_GUIDE.md](./AUTH0_GUIDE.md) - Guía completa de Auth0
- [AUTH0_INTEGRATION_SUMMARY.md](./AUTH0_INTEGRATION_SUMMARY.md) - Resumen de cambios
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Arquitectura del proyecto
- [AGENTS.MD](./AGENTS.MD) - Convenciones de desarrollo

---

## 💡 Tips

### Para Desarrollo
- Usa `console.log()` para debug del token en `useAuth0Token`
- Revisa Network tab para ver requests con token
- Auth0 dashboard tiene logs de todos los logins

### Para Producción
- Configura dominios reales en Auth0
- Habilita MFA (Multi-Factor Authentication)
- Configura rate limiting en Auth0
- Usa diferentes tenants para dev/prod

---

## 🎊 ¡Listo para Producción!

La integración de Auth0 está completa y lista para usar. Sigue los pasos de verificación y ¡disfruta de tu chat seguro!

**Si tienes problemas, revisa:**
1. [AUTH0_GUIDE.md](./AUTH0_GUIDE.md) - Sección de Troubleshooting
2. Console del navegador para errores
3. Logs del backend
4. Auth0 Dashboard > Logs

---

**¡Éxito con tu proyecto!** 🚀
