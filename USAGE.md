# 🚀 Guía de Uso - UNA Chat

## Inicio Rápido

### 1. Iniciar el Backend

```bash
# En una terminal, navega a la carpeta del backend
cd backend

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar el servidor
npm run dev
```

El backend estará disponible en: `http://localhost:5000`

### 2. Iniciar el Frontend

```bash
# En otra terminal, desde la raíz del proyecto
npm install  # Solo la primera vez
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 📝 Uso de la Aplicación

### Primera Vez

1. Abre tu navegador en `http://localhost:5173`
2. Verás una pantalla de bienvenida solicitando tu nombre de usuario
3. Ingresa un nombre (mínimo 3 caracteres)
4. Haz clic en "Start Chatting"

### Enviando Mensajes

1. Escribe tu mensaje en el campo de texto inferior
2. Presiona `Enter` o haz clic en el botón de enviar
3. Tu mensaje aparecerá instantáneamente en el chat
4. Los mensajes de otros usuarios aparecerán en tiempo real

### Características Especiales

- **Auto-scroll:** El chat se desplaza automáticamente a los mensajes más recientes
- **Contador de caracteres:** Se muestra cuando quedan menos de 100 caracteres disponibles
- **Multilinea:** Usa `Shift + Enter` para agregar saltos de línea
- **Indicador de conexión:** El punto verde/rojo en el header indica el estado de conexión

---

## 🎨 Personalización

### Cambiar Tu Nombre

1. Haz clic en el botón de logout en el header
2. Confirma que deseas cerrar sesión
3. Ingresa un nuevo nombre de usuario

### Colores de Usuario

Los colores se asignan automáticamente de forma aleatoria cuando te unes al chat.

---

## 🔒 Seguridad

### Medidas Implementadas

- ✅ **Sanitización XSS:** Todo el contenido se sanitiza antes de mostrarse
- ✅ **Validación de entrada:** Los mensajes se validan antes de enviarse
- ✅ **Rate limiting:** Máximo 30 mensajes por minuto
- ✅ **Conexión segura:** WebSocket con reconexión automática
- ✅ **Almacenamiento seguro:** sessionStorage en lugar de localStorage

### Límites

- **Username:** 3-50 caracteres
- **Mensaje:** 1-5000 caracteres
- **Mensajes por minuto:** 30 máximo

---

## 🐛 Solución de Problemas

### El chat no se conecta

1. Verifica que el backend esté corriendo (`http://localhost:5000`)
2. Revisa la consola del navegador (F12) para ver errores
3. Verifica que el puerto 5000 no esté en uso por otra aplicación

### Los mensajes no se envían

1. Verifica el indicador de conexión en el header (debe estar verde)
2. Asegúrate de no exceder el límite de caracteres (5000)
3. Revisa que no estés siendo rate-limited (30 msg/min)

### El frontend no carga

```bash
# Limpia el caché y reinstala dependencias
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📱 Compatibilidad

### Navegadores Soportados

- ✅ Chrome/Edge (últimas 2 versiones)
- ✅ Firefox (últimas 2 versiones)
- ✅ Safari (últimas 2 versiones)

### Dispositivos

- ✅ Desktop (Windows, macOS, Linux)
- ✅ Tablet (iPad, Android tablets)
- ✅ Mobile (iPhone, Android)

---

## 🎯 Características Avanzadas

### Soporta URLs de Imágenes

El chat detecta automáticamente URLs de imágenes de dominios permitidos:
- imgur.com
- giphy.com
- unsplash.com
- pixabay.com

### Soporta URLs de Videos

También detecta videos de:
- YouTube (se convierte a embed automáticamente)
- Vimeo

**Nota:** Solo URLs de dominios whitelisteados por seguridad.

---

## 🔧 Configuración Avanzada

### Variables de Entorno

Edita el archivo `.env`:

```env
# URL del backend
VITE_API_URL=http://localhost:5000/api

# URL de WebSocket
VITE_SOCKET_URL=http://localhost:5000
```

### Cambiar Puerto del Frontend

Edita `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3000, // Cambiar aquí
  },
})
```

---

## 📚 Recursos Adicionales

- [Documentación API](http://localhost:5000/api-docs)
- [Especificaciones Técnicas](./AGENTS.MD)
- [README Principal](./README.md)

---

## 💡 Consejos

1. **Usa nombres cortos:** Son más fáciles de leer en el chat
2. **Sé respetuoso:** Mantén las conversaciones apropiadas
3. **Reporta bugs:** Si encuentras algún problema, repórtalo
4. **Revisa la consola:** F12 para ver logs y errores

---

**¿Necesitas ayuda?** Consulta la documentación o contacta al equipo de desarrollo.
