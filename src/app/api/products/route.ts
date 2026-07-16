import { NextRequest, NextResponse } from 'next/server'
import { getAllProducts, createProduct } from '@/lib/data/products'
import type { Product } from '@/types'

export async function GET() {
  const products = getAllProducts()
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const body: Product = await request.json()
  const product: Product = {
    ...body,
    id: body.id || 'prod-' + Date.now(),
  }
  const created = createProduct(product)
  return NextResponse.json(created, { status: 201 })
}
