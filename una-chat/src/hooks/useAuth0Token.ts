import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { AUTH0_AUDIENCE } from '../utils/constants'

export function useAuth0Token() {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0()
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      if (!isAuthenticated || isLoading) {
        setToken(null)
        return
      }

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: AUTH0_AUDIENCE,
          },
        })

        setToken(accessToken)
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get access token'
        setError(errorMessage)
        console.error('Error getting access token:', err)
      }
    }

    getToken()
  }, [isAuthenticated, isLoading, getAccessTokenSilently])

  return { token, error, isLoading }
}
