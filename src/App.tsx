import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { ChatContainer } from './components/chat/ChatContainer'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAuth0Token } from './hooks/useAuth0Token'
import { apiService } from './services/api.service'
import { socketService } from './services/socket.service'
import { verifyChatIntegration } from './services/chatVerifier'
import { inspectToken } from './utils/tokenInspector'
import { Sentry } from './config/sentry.config'
import './index.css'

// Sentry Error Test Button - Remove in production
function ErrorButton() {
  return (
    <button
      onClick={() => {
        Sentry.captureMessage('User triggered test log', {
          level: 'info',
          tags: { log_source: 'sentry_test' }
        })
        console.log('✅ Test message sent to Sentry')
      }}
      className="fixed bottom-20 right-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg z-50"
    >
      Test Sentry
    </button>
  )
}

function App() {
  const { user, logout, isAuthenticated } = useAuth0()
  const { token } = useAuth0Token()

  useEffect(() => {
    if (token) {
      apiService.setToken(token)
      socketService.disconnect()
      socketService.connect(token)
      // In development, perform an integration check and log results
      if (import.meta.env.DEV) {
        // Quick token inspection
        try {
          const info = inspectToken(token)
          console.info('Auth token inspection:', info)
        } catch (e) {
          console.warn('Token inspection failed:', e)
        }

        ;(async () => {
          const res = await verifyChatIntegration(token, { timeoutMs: 4000 })
          if (res.ok) {
            console.info('Chat integration check: OK', res.messages)
          } else {
            console.warn('Chat integration check: issues detected', res.messages)
          }
        })()
      }
    }
  }, [token])

  const handleLogout = (): void => {
    if (confirm('Are you sure you want to logout?')) {
      socketService.clearAllListeners()
      socketService.disconnect()
      sessionStorage.clear()
      logout({ 
        logoutParams: { 
          returnTo: window.location.origin 
        } 
      })
    }
  }

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="flex flex-col h-screen">
          <Header 
            username={isAuthenticated ? (user?.name || user?.email || 'User') : ''} 
            onLogout={handleLogout} 
          />
          <main className="flex-1 overflow-hidden">
            <ChatContainer />
          </main>
          <Footer />
          {/* Sentry test button - Remove in production */}
          {import.meta.env.DEV && <ErrorButton />}
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  )
}

export default App
