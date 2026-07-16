import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session'

// Use the Node.js runtime so we can reuse the Node `crypto`-based session lib.
// NOTE: /api/upload is intentionally excluded from the matcher. Middleware
// buffers the request body (capped at 10MB in this Next version), which
// breaks large video uploads. The upload route performs its own in-handler
// auth check instead.
export const config = {
  runtime: 'nodejs',
  matcher: ['/admin/:path*', '/api/((?!upload).*)'],
}

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const user = verifySessionToken(token)

  // --- Protect admin pages ---
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // --- Protect API write operations ---
  // Read operations (GET) on /api/products, /api/categories, /api/scenarios
  // remain public so the front-end catalog works without auth. All writes
  // require a valid admin session.
  if (pathname.startsWith('/api/') && WRITE_METHODS.has(request.method)) {
    // Auth endpoints are open (login must be callable unauthenticated)
    if (pathname.startsWith('/api/auth')) {
      return NextResponse.next()
    }
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}
