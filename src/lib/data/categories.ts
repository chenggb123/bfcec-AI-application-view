import fs from 'fs'
import path from 'path'

const CATEGORIES_FILE = path.join(process.cwd(), 'data', 'categories.json')

export interface CategoryPair {
  zh: string
  en: string
}

const SEED_CATEGORIES: CategoryPair[] = [
  { zh: '智能工厂', en: 'Smart Factory' },
  { zh: '智能服务', en: 'Smart Service' },
  { zh: '智能质量', en: 'Smart Quality' },
  { zh: '效率工具', en: 'Efficiency Tools' },
]

function readCategories(): CategoryPair[] {
  try {
    const raw = fs.readFileSync(CATEGORIES_FILE, 'utf-8')
    if (!raw.trim()) return SEED_CATEGORIES
    const data = JSON.parse(raw)
    if (!Array.isArray(data) || data.length === 0) return SEED_CATEGORIES
    return data as CategoryPair[]
  } catch {
    return SEED_CATEGORIES
  }
}

function writeCategories(categories: CategoryPair[]): void {
  const dir = path.dirname(CATEGORIES_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8')
}

export function getCategories(): CategoryPair[] {
  return readCategories()
}

export function addCategory(zh: string, en: string): CategoryPair[] {
  const categories = readCategories()
  if (!categories.find((c) => c.zh === zh)) {
    categories.push({ zh, en: en || zh })
  }
  writeCategories(categories)
  return categories
}

export function updateCategory(oldZh: string, zh: string, en: string): CategoryPair[] {
  const categories = readCategories()
  const idx = categories.findIndex((c) => c.zh === oldZh)
  if (idx !== -1) {
    categories[idx] = { zh: zh || oldZh, en: en || categories[idx].en }
  }
  writeCategories(categories)
  return categories
}

export function deleteCategory(zh: string): CategoryPair[] {
  const categories = readCategories()
  const filtered = categories.filter((c) => c.zh !== zh)
  writeCategories(filtered)
  return filtered
}
