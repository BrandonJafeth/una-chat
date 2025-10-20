import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

function Login() {
  const { loginWithRedirect, isLoading } = useAuth0()
  const [isSignup, setIsSignup] = useState(false)

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: 'login',
        },
      })
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleSignup = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup',
        },
      })
    } catch (error) {
      console.error('Signup error:', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 p-4">
      <div className="w-full max-w-sm">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-center">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">UNA Chat</h1>
            <p className="text-blue-100 text-sm">Secure messaging with Auth0</p>
          </div>

          {/* Content */}
          <div className="px-8 py-10">
            {/* Toggle Buttons */}
            <div className="flex gap-3 mb-8 bg-gray-50 p-1.5 rounded-xl">
              <button
                onClick={() => setIsSignup(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  !isSignup
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsSignup(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  isSignup
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Main Action Button */}
            <button
              onClick={isSignup ? handleSignup : handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-4 text-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </span>
              ) : isSignup ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>

            {/* Description */}
            <p className="text-center text-sm text-gray-600 mb-6">
              {isSignup
                ? 'Create a new account with Auth0 to start chatting securely'
                : 'Sign in with your Auth0 account to access the chat'}
            </p>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500 font-medium">
                🔒 Secured by Auth0 • Enterprise-grade security
              </p>
            </div>
          </div>
        </div>

        {/* Features Box */}
        <div className="mt-6 bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
          <p className="text-white font-bold mb-3 flex items-center gap-2">
            <span className="text-xl">✨</span> Features
          </p>
          <ul className="space-y-2 text-white/90 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold mt-0.5">•</span>
              <span>End-to-end secure messaging</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold mt-0.5">•</span>
              <span>Real-time chat with WebSocket</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-300 font-bold mt-0.5">•</span>
              <span>Auth0 authentication</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login
