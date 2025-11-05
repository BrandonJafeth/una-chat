// Lightweight JWT inspector (no crypto verification) — decodes payload and returns claims
export function decodeJwt(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    // base64url decode
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json)
  } catch (err) {
    console.warn('Failed to decode JWT:', err)
    return null
  }
}

export function inspectToken(token: string | null | undefined) {
  if (!token) {
    console.warn('No access token provided to inspect')
    return null
  }

  const claims = decodeJwt(token)
  if (!claims) {
    console.warn('Token present but could not decode payload (maybe opaque token)')
    return null
  }

  const now = Math.floor(Date.now() / 1000)
  const expiresIn = claims.exp ? claims.exp - now : undefined

  return {
    claims,
    expiresIn,
    isExpired: expiresIn !== undefined ? expiresIn <= 0 : undefined,
  }
}

export default inspectToken
