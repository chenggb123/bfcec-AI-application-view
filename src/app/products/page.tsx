import { getAllProducts } from '@/lib/data/products'
import ProductsClient from './ProductsClient'


export default async function ProductsPage() {
  const all = await getAllProducts()
  const products = all.filter((p) => p.status === 'published')
  // Build bilingual category pairs
  const catMap = new Map<string, string>()
  all.forEach((p) => { catMap.set(p.category, p.categoryEn || p.category) })
  const categories = Array.from(catMap.entries()).map(([zh, en]) => ({ zh, en }))
  return <ProductsClient products={products} categories={categories} />
}
