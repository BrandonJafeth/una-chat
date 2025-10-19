import { useAuth0 } from '@auth0/auth0-react'
import { type ReactNode } from 'react'
import Login from './Login'
import { Loading } from '../common/Loading'


interface ProtectedRouteProps {
  children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return <>{children}</>
}

export default ProtectedRoute
