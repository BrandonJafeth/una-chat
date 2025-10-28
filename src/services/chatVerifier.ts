import { apiService } from './api.service'
import { io, type Socket } from 'socket.io-client'
import { SOCKET_URL } from '../utils/constants'

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

      // Accept multiple possible health response shapes from different backends
      const healthOk = !!(
        healthResp?.success ||
        // some backends return { ok: true }
        (healthResp as any)?.ok ||
        // or { status: 'ok' }
        (healthResp as any)?.status === 'ok' ||
        // or wrapped in data: { data: { success: true } }
        (healthResp as any)?.data?.success
      )

      if (healthOk) {
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
      // create a temporary socket for the integration check so we don't interfere
      // with the app's main socketService singleton
      const tempSocket: Socket = io(SOCKET_URL, {
        auth: token ? { token } : {},
        transports: ['websocket', 'polling'],
        timeout: timeoutMs,
      })

      tempSocket.once('connect', onConnect)
      tempSocket.once('connect_error', onConnectError)

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

      // cleanup temporary socket
      try {
        tempSocket.off('connect', onConnect)
        tempSocket.off('connect_error', onConnectError)
        tempSocket.disconnect()
      } catch (e) {
        // ignore
      }
    } catch (err) {
      messages.push(`Socket check failed: ${err instanceof Error ? err.message : String(err)}`)
    }

    const ok = messages.every((m) => !/failed|error|timeout/i.test(m))
    return { ok, messages }
  } catch (err) {
    return { ok: false, messages: [`Verifier unexpected error: ${err instanceof Error ? err.message : String(err)}`] }
  }
}

export default verifyChatIntegration
