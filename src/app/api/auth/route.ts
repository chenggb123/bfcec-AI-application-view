import { NextRequest, NextResponse } from 'next/server'
import { validateCredentials } from '@/lib/data/auth'
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from '@/lib/auth/session'

// Rate limiting per IP (in-memory).
// Set AUTH_RATE_LIMIT_MAX=0 to disable rate limiting entirely.
// For multi-instance k8s, consider disabling this and using an ingress-level
// rate limiter instead — in-memory counters don't share across pods.
const WINDOW_MS = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000 // 15 min
const MAX_ATTEMPTS = (() => {
  const v = process.env.AUTH_RATE_LIMIT_MAX
  if (v === undefined || v === '') return 10 // default
  return Number(v) // 0 = disable
})()
const attempts = new Map<string, { count: number; first: number }>()

function rateLimited(ip: string): boolean {
  if (MAX_ATTEMPTS <= 0) return false // disabled
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now })
    return false
  }
  entry.count += 1
  return entry.count > MAX_ATTEMPTS
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Try again later.' },
      { status: 429 }
    )
  }

  let username = ''
  let password = ''
  try {
    const body = await request.json()
    username = String(body?.username || '')
    password = String(body?.password || '')
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  const success = validateCredentials(username, password)
  if (!success) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const token = createSessionToken(username)
  const res = NextResponse.json({ success: true })

  // Determine if the cookie should be `secure`:
  //   1. COOKIE_SECURE env var (explicit override)
  //   2. x-forwarded-proto header (reverse proxy)
  //   3. Fall back to request protocol (direct connection)
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const secure =
    process.env.COOKIE_SECURE !== undefined
      ? process.env.COOKIE_SECURE === 'true'
      : forwardedProto
        ? forwardedProto === 'https'
        : request.nextUrl.protocol === 'https:'

  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE,
  })
  return res
}
