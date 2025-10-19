import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '../common/Button'


function Login() {
  const { loginWithRedirect, isLoading } = useAuth0()

  const handleLogin = async () => {
    try {
      await loginWithRedirect()
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            UNA Chat
          </h1>
          <p className="text-gray-600">
            Secure chat application with Auth0
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Connecting...' : 'Login with Auth0'}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Click the button above to authenticate with Auth0
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Protected by Auth0 authentication
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
