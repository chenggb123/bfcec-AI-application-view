export interface Benefit {
  label: string
  labelEn: string
  value: number
  unit: string
  unitEn: string
}

export interface Product {
  id: string
  name: string
  nameEn: string
  excerpt: string
  excerptEn: string
  description: string
  descriptionEn: string
  category: string
  categoryEn: string
  scenario: string
  scenarioEn: string
  status: 'published' | 'draft'
  recommended: boolean
  screenshots: string[]
  videoUrl: string
  benefits: Benefit[]
  before: string
  beforeEn: string
  after: string
  afterEn: string
  painPoints: string
  painPointsEn: string
  solution: string
  solutionEn: string
  thumb: string
}
