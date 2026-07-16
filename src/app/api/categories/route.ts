import { NextRequest, NextResponse } from 'next/server'
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/data/categories'

export async function GET() {
  const categories = getCategories()
  return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
  const { zh, en } = await request.json()
  if (!zh) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const categories = addCategory(zh, en || zh)
  return NextResponse.json(categories, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const oldZh = searchParams.get('old')
  if (!oldZh) return NextResponse.json({ error: 'Missing old parameter' }, { status: 400 })
  const { zh, en } = await request.json()
  const categories = updateCategory(oldZh, zh, en)
  return NextResponse.json(categories)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const zh = searchParams.get('zh')
  if (!zh) return NextResponse.json({ error: 'Missing zh parameter' }, { status: 400 })
  const categories = deleteCategory(zh)
  return NextResponse.json(categories)
}
