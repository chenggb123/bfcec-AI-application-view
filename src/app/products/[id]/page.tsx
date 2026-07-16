import { getAllProducts, getProductById } from '@/lib/data/products'
import ProductDetailClient from './ProductDetailClient'

export function generateStaticParams() {
  const products = getAllProducts()
  return products.map((p) => ({ id: p.id }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id)
  return <ProductDetailClient product={product} />
}
