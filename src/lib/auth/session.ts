import crypto from 'crypto'

// Session is an HMAC-signed token stored in an HttpOnly cookie.
// token format: base64url(payload).base64url(hmac)
// This lets stateless middleware (edge runtime) verify authenticity without
// a shared session store.

const SESSION_COOKIE = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

function getSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    // In dev without a configured secret, derive one. In production this
    // should always be set — middleware will refuse to trust sessions that
    // cannot be verified.
    return 'dev-insecure-secret-do-not-use-in-prod'
  }
  return secret
}

interface Payload {
  u: string // username
  exp: number // expiry epoch seconds
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString('base64url')
}

function sign(data: string): string {
  return crypto.createHmac('sha256', getSecret()).update(data).digest('base64url')
}

/** Issue a signed session token. */
export function createSessionToken(username: string): string {
  const payload: Payload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE,
  }
  const payloadStr = b64url(JSON.stringify(payload))
  return `${payloadStr}.${sign(payloadStr)}`
}

/** Verify a token signature and expiry. Returns username on success. */
export function verifySessionToken(token: string | undefined | null): string | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payloadStr, sig] = parts

  // Constant-time signature comparison
  const expected = sign(payloadStr)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return null
  if (!crypto.timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8')) as Payload
    if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return payload.u || null
  } catch {
    return null
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE
export const SESSION_COOKIE_MAX_AGE = COOKIE_MAX_AGE
