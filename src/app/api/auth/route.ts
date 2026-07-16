import { NextRequest, NextResponse } from 'next/server'
import { validateCredentials } from '@/lib/data/auth'
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from '@/lib/auth/session'

// Simple in-memory rate limiting per IP. Resets after the window.
// (A single-instance dev server is fine; for multi-instance use Redis.)
const WINDOW_MS = 15 * 60 * 1000 // 15 min
const MAX_ATTEMPTS = 10
const attempts = new Map<string, { count: number; first: number }>()

function rateLimited(ip: string): boolean {
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
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE,
  })
  return res
}
