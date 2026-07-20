import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// MIME map for common upload file types
const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
}

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads')

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params

  // Security: prevent directory traversal
  if (segments.some((s) => s.includes('..') || s.includes('~') || s.includes('\0'))) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const filePath = path.join(UPLOAD_ROOT, ...segments)

  // Ensure the resolved path stays inside the upload root
  const resolved = path.resolve(filePath)
  if (!resolved.startsWith(path.resolve(UPLOAD_ROOT) + path.sep)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  try {
    const stat = fs.statSync(resolved)
    if (!stat.isFile()) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const buffer = fs.readFileSync(resolved)
    const ext = path.extname(resolved).toLowerCase()
    const contentType = MIME[ext] || 'application/octet-stream'

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(stat.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
}
