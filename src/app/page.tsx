import { getAllProducts } from '@/lib/data/products'
import { HeroSection } from '@/components/home/HeroSection'
import { CapabilityCards } from '@/components/home/CapabilityCards'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { StatsSection } from '@/components/home/StatsSection'


export default async function HomePage() {
  const products = await getAllProducts()
  const featured = products.filter((p) => p.recommended && p.status === 'published')
  const agentCount = products.filter((p) => p.status === 'published').length
  const categoryCount = [...new Set(products.map((p) => p.category))].length
  return (
    <>
      <HeroSection />
      <CapabilityCards />
      <FeaturedProducts products={featured} />
      <StatsSection agentCount={agentCount} categoryCount={categoryCount} />
    </>
  )
}
