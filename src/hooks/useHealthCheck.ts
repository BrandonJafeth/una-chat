import { useState, useEffect, useRef, useCallback } from 'react'
import { apiService } from '../services/api.service'

interface HealthStatus {
  isHealthy: boolean
  lastChecked: Date | null
  isChecking: boolean
  error: string | null
}

interface UseHealthCheckReturn extends HealthStatus {
  checkHealth: () => Promise<void>
}

/**
 * useHealthCheck
 * - By default performs a single health check on mount.
 * - Exposes a manual `checkHealth` to trigger on demand (e.g. button click or when socket disconnects).
 * - Removed automatic polling to avoid repeated requests and hit rate limits on the backend.
 */
export function useHealthCheck(): UseHealthCheckReturn {
  const [isHealthy, setIsHealthy] = useState<boolean>(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [isChecking, setIsChecking] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // use a ref to avoid recreating the callback when isChecking changes
  const isCheckingRef = useRef<boolean>(false)
  isCheckingRef.current = isChecking

  const checkHealth = useCallback(async () => {
    // avoid concurrent checks
    if (isCheckingRef.current) return

    setIsChecking(true)
    isCheckingRef.current = true
    setError(null)

    try {
      const response = await apiService.get('/health')
      // Response shape may vary; accept boolean success or truthy
  const healthy = !!(response && (response.success ?? true))
      setIsHealthy(healthy)
      setLastChecked(new Date())
    } catch (err) {
      setIsHealthy(false)
      setError(err instanceof Error ? err.message : 'Health check failed')
      setLastChecked(new Date())
    } finally {
      setIsChecking(false)
      isCheckingRef.current = false
    }
  }, [])

  useEffect(() => {
    // Initial one-off health check on mount. No polling to prevent rate limits.
    void checkHealth()
    // Intentionally no dependencies beyond checkHealth (which is stable via empty deps)
  }, [checkHealth])

  return {
    isHealthy,
    lastChecked,
    isChecking,
    error,
    checkHealth,
  }
}
