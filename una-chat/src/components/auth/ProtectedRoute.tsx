import { useAuth0 } from '@auth0/auth0-react'
import { type ReactNode } from 'react'
import { Loading } from '../common/Loading'

interface ProtectedRouteProps {
  children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading } = useAuth0()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loading size="lg" />
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
