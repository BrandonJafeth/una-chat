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

function App() {
  const { user, logout, isAuthenticated } = useAuth0()
  const { token } = useAuth0Token()

  useEffect(() => {
    if (token) {
      apiService.setToken(token)
      socketService.disconnect()
      socketService.connect(token)
    }
  }, [token])

  const handleLogout = (): void => {
    if (confirm('Are you sure you want to logout?')) {
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
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  )
}

export default App
