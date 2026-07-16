import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'scenarios.json')

interface Scenario { zh: string; en: string }

function read(): Scenario[] {
  try {
    const raw = fs.readFileSync(FILE, 'utf-8')
    return JSON.parse(raw) as Scenario[]
  } catch { return [] }
}

function write(data: Scenario[]): void {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  return NextResponse.json(read())
}

export async function POST(request: NextRequest) {
  const { zh, en } = await request.json()
  if (!zh) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const data = read()
  if (data.find(s => s.zh === zh)) return NextResponse.json({ error: 'Exists' }, { status: 409 })
  data.push({ zh, en: en || zh })
  write(data)
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const { oldZh, zh, en } = await request.json()
  const data = read()
  const idx = data.findIndex(s => s.zh === oldZh)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  data[idx] = { zh: zh || oldZh, en: en || data[idx].en }
  write(data)
  return NextResponse.json(data)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const zh = searchParams.get('zh')
  if (!zh) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const data = read().filter(s => s.zh !== zh)
  write(data)
  return NextResponse.json({ success: true })
}
