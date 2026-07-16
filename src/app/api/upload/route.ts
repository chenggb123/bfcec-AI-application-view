import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth/session'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024 // 200MB

export async function POST(request: NextRequest) {
  // In-handler auth: this route is excluded from middleware (which would
  // buffer the large upload body), so verify the session cookie here.
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Determine subfolder
    const type = formData.get('type') as string || 'screenshots'
    const isVideo = type === 'video'

    // Validate type
    if (isVideo) {
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Unsupported video type: ${file.type}` }, { status: 400 })
      }
    } else {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 })
      }
    }

    // Validate size
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large (max ${isVideo ? '200MB' : '10MB'})` }, { status: 400 })
    }

    // Determine subfolder
    const subfolder = type === 'thumbnail' ? 'thumbnails' : type === 'video' ? 'videos' : 'screenshots'
    const targetDir = path.join(UPLOAD_DIR, subfolder)

    // Ensure directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    // Generate unique filename — derive extension from the validated MIME
    // type rather than the user-supplied filename to prevent extension
    // spoofing (e.g. evil.php.png) and path traversal via crafted names.
    const extByType: Record<string, string> = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'video/quicktime': 'mov',
    }
    const ext = extByType[file.type] || 'bin'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const filepath = path.join(targetDir, filename)

    // Sanity check: ensure resolved path stays inside the upload dir
    const resolvedTarget = path.resolve(targetDir)
    const resolvedFile = path.resolve(filepath)
    if (!resolvedFile.startsWith(resolvedTarget + path.sep)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filepath, buffer)

    // Return public URL
    const url = `/uploads/${subfolder}/${filename}`
    return NextResponse.json({ url })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
