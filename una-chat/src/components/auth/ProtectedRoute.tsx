import { useAuth0 } from '@auth0/auth0-react'
import { type ReactNode, useEffect, useRef } from 'react'
import { Loading } from '../common/Loading'

interface ProtectedRouteProps {
  children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()
  const redirected = useRef(false)

  // detect auth callback errors in URL (e.g. ?error=access_denied&error_description=...)
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const callbackError = urlParams?.get('error')
  const callbackErrorDesc = urlParams?.get('error_description')

  useEffect(() => {
    // If there's an auth error returned to the callback, do not auto redirect to avoid a loop.
    if (callbackError) {
      console.warn('Auth callback error detected:', callbackError, callbackErrorDesc)
      return
    }

    if (!isLoading && !isAuthenticated && !redirected.current) {
      redirected.current = true
      // trigger Auth0 login redirect; catch errors to avoid unhandled promise
      loginWithRedirect().catch((err) => console.error('Auth0 login redirect failed:', err))
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, callbackError, callbackErrorDesc])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loading size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    // If there's an auth callback error, show it and provide a manual retry button.
    if (callbackError) {
      const message = decodeURIComponent(callbackErrorDesc || callbackError)
      const handleRetry = async () => {
        try {
          // remove query params to avoid re-processing the same error after redirect
          const cleanUrl = window.location.origin + window.location.pathname
          window.history.replaceState({}, document.title, cleanUrl)
          await loginWithRedirect()
        } catch (err) {
          console.error('Retry login failed:', err)
        }
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-xl text-center bg-white/60 p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-2 text-red-600">Authentication error</h2>
            <p className="text-sm text-gray-700 mb-4">{message}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-5 py-2 bg-blue-600 text-white rounded-md"
              >
                Retry login
              </button>
              <button
                onClick={() => {
                  // go to root without query params
                  const cleanUrl = window.location.origin + window.location.pathname
                  window.location.href = cleanUrl
                }}
                className="px-5 py-2 border rounded-md"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      )
    }

    // We're not authenticated and a redirect is in progress (or will be); show a friendly message
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loading size="lg" />
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
