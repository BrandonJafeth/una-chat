import { apiService } from './api.service'
import { socketService } from './socket.service'

type CheckResult = {
  ok: boolean
  messages: string[]
}

const timeout = (ms: number) => new Promise((res) => setTimeout(res, ms))

export async function verifyChatIntegration(token?: string, opts?: { timeoutMs?: number }): Promise<CheckResult> {
  const messages: string[] = []
  const timeoutMs = opts?.timeoutMs ?? 5000

  try {
    // Ensure token is set for apiService
    if (token) {
      apiService.setToken(token)
      messages.push('Auth token set for API service')
    } else {
      messages.push('No token provided; api requests may be unauthorized')
    }

    // 1) Check API health endpoint
    try {
      const healthResp = await Promise.race([
        apiService.get('/health'),
        timeout(timeoutMs).then(() => ({ success: false, error: { message: 'health check timeout' } } as any)),
      ])

      if (healthResp?.success) {
        messages.push('API health: ok')
      } else if (healthResp?.error) {
        messages.push(`API health error: ${healthResp.error.message || JSON.stringify(healthResp.error)}`)
      } else {
        messages.push('API health: unexpected response')
      }
    } catch (err) {
      messages.push(`API health request failed: ${err instanceof Error ? err.message : String(err)}`)
    }

    // 2) Check socket connection with token
    let connected = false

    const onConnect = () => {
      connected = true
    }

    const onConnectError = (err: unknown) => {
      messages.push(`Socket connect_error: ${err instanceof Error ? err.message : JSON.stringify(err)}`)
    }

    try {
      socketService.connect(token)
      socketService.getSocket()?.once('connect', onConnect)
      socketService.getSocket()?.once('connect_error', onConnectError)

      // wait briefly for connection or timeout
      const start = Date.now()
      while (Date.now() - start < timeoutMs && !connected) {
        // eslint-disable-next-line no-await-in-loop
        await timeout(100)
      }

      if (connected) {
        messages.push('Socket connection: ok')
      } else {
        messages.push('Socket connection: timeout or failed')
      }
    } catch (err) {
      messages.push(`Socket check failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      // cleanup
      try {
        socketService.getSocket()?.off('connect', onConnect)
        socketService.getSocket()?.off('connect_error', onConnectError)
        socketService.disconnect()
      } catch (e) {
        // ignore
      }
    }

    const ok = messages.every((m) => !/failed|error|timeout/i.test(m))
    return { ok, messages }
  } catch (err) {
    return { ok: false, messages: [`Verifier unexpected error: ${err instanceof Error ? err.message : String(err)}`] }
  }
}

export default verifyChatIntegration
