import crypto from 'crypto'

// Credentials are sourced from environment variables so they are never
// committed to source control. Fallbacks are intentionally weak/dev-only.
const ADMIN_USER = process.env.ADMIN_USERNAME || ''
const ADMIN_PASS = process.env.ADMIN_PASSWORD || ''

// Use a constant-time comparison to avoid timing-based username/password
// enumeration attacks.
function timingSafeEqualStr(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) {
    // Compare b against itself to keep timing roughly constant, then return false
    crypto.timingSafeEqual(bBuf, bBuf)
    return false
  }
  return crypto.timingSafeEqual(aBuf, bBuf)
}

export function validateCredentials(username: string, password: string): boolean {
  // If credentials are not configured via env, reject all logins rather than
  // falling back to a hardcoded default in production-like deployments.
  if (!ADMIN_USER || !ADMIN_PASS) {
    return false
  }
  return timingSafeEqualStr(username, ADMIN_USER) && timingSafeEqualStr(password, ADMIN_PASS)
}
