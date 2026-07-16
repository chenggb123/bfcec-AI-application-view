# AGENTS.md — BFCEC AI Center

## Project Introduction

BFCEC AI Center is an enterprise AI product showcase and management platform built with **Next.js 16 (App Router)** + **TypeScript** + **Tailwind CSS v4**.

The platform includes:
- **Public pages**: Home, Product Catalog, Product Detail, Login
- **Admin panel**: Dashboard, Product CRUD, Category Management
- **Design System Preview**: Dev-only component validation page

Design follows Foton Cummins brand guidelines with a dark tech theme.

---

## Frontend Directory Structure

`
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (Nav + Footer + I18nProvider)
│   ├── page.tsx                  # Home page
│   ├── products/
│   │   ├── page.tsx              # Products listing (Server + Client)
│   │   └── [id]/page.tsx         # Product detail
│   ├── login/page.tsx            # Login page
│   ├── admin/
│   │   ├── layout.tsx            # Admin shell (Sidebar + auth guard)
│   │   ├── page.tsx              # Dashboard
│   │   ├── products/page.tsx     # Product management
│   │   └── categories/page.tsx   # Category management
│   ├── design-system/page.tsx    # Design system preview (dev only)
│   └── api/                      # API routes
│       ├── products/route.ts & [id]/route.ts
│       ├── categories/route.ts
│       └── auth/route.ts
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx            # primary/ghost/danger/success x sm/md/lg
│   │   ├── Card.tsx              # hover: none/lift/glow
│   │   ├── Input.tsx             # leftIcon, error
│   │   ├── Badge.tsx             # published/draft
│   │   ├── Chip.tsx              # active, onClick
│   │   ├── Modal.tsx             # Portal, ESC close, overlay close
│   │   ├── SearchBox.tsx         # Search icon + Input
│   │   ├── Tabs.tsx              # Bottom border indicator
│   │   ├── Carousel.tsx          # Auto-play, touch swipe, dots
│   │   └── Reveal.tsx            # Scroll-triggered fade-in
│   ├── layout/                   # Layout components
│   │   ├── Nav.tsx               # Glassmorphism, scroll state, mobile menu
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx           # Admin sidebar
│   │   └── PageHeader.tsx        # Page title area
│   ├── home/                     # Home page components
│   │   ├── ParticleCanvas.tsx    # Three.js 3D particle background
│   │   ├── HeroSection.tsx       # Mouse-tracking glow hero
│   │   ├── CapabilityCards.tsx   # 3 capability cards
│   │   └── StatsSection.tsx      # Count-up statistics
│   ├── product/                  # Product module components
│   │   ├── ProductCard.tsx       # Border beam animation on hover
│   │   ├── ProductGrid.tsx       # Responsive grid + empty state
│   │   ├── ProductToolbar.tsx    # Search + filter chips
│   │   ├── BenefitCard.tsx       # Animated progress bars
│   │   ├── CompareSection.tsx    # Before/After comparison
│   │   └── TechStack.tsx         # Tech tag list
│   └── admin/                    # Admin components
│       ├── StatsGrid.tsx         # Dashboard stats
│       ├── ProductTable.tsx      # Product data table
│       ├── ProductEditor.tsx     # Product editor modal (5 tabs)
│       └── CategoryManager.tsx   # Category CRUD manager
├── lib/
│   ├── design-tokens.ts          # Design token JS constants
│   ├── cn.ts                     # className merge utility (clsx)
│   ├── data/                     # Data repository layer
│   │   ├── products.ts           # ProductRepository (JSON file I/O)
│   │   ├── categories.ts         # CategoryRepository
│   │   └── auth.ts               # Credential validation
│   └── i18n/                     # Internationalization
│       ├── zh.ts                 # Chinese translations
│       ├── en.ts                 # English translations
│       └── index.tsx             # I18nProvider + useI18n hook
├── hooks/
│   ├── useScrollReveal.ts        # IntersectionObserver reveal
│   └── useI18n.ts                # i18n hook re-export
└── types/
    └── index.ts                  # Product, Benefit type definitions
data/                             # JSON data files
├── products.json                 # Seed product data
└── categories.json               # Seed category data
`

---

## Design System Architecture

### Design Tokens

All tokens are defined in src/app/globals.css via @theme block and :root CSS custom properties:

| Category | Token | Value |
|----------|-------|-------|
| Primary | --accent / brand-red | #DA291C |
| Primary Hover | brand-red-hover | #EC001A |
| Background | --bg / surface-bg | #0a0a0a |
| Surface | --surface / surface | #141414 |
| Text | --fg / text-primary | #e8e8e8 |
| Muted Text | --muted / text-muted | #8a8a8a |
| Border | --border | gba(255,255,255,0.07) |
| Radius Small | --radius-sm | 6px |
| Radius Medium | --radius-md | 10px |
| Radius Large | --radius-lg | 16px |

### Fonts

| Token | Usage | Font Stack |
|-------|-------|------------|
| --font-display | Headings | Helvetica Neue, PingFang SC, Microsoft YaHei, system-ui |
| --font-body | Body text | PingFang SC, Microsoft YaHei, Helvetica Neue, system-ui |
| --font-mono | Labels/Numbers | SF Mono, JetBrains Mono, ui-monospace, Menlo, monospace |

### Auxiliary Colors

- rand-dark-blue: #005587
- rand-light-blue: #0085AD
- rand-green-yellow: #808C24
- rand-dark-green: #006C5B
- success: #22c55e
- warn: #f59e0b

---

## Component Reuse Rules

### Priority

1. **Always check existing components first** — Before building a new page, check src/components/ for existing matching components
2. **Extend via props first** — If an existing component can be adapted via ariant, size, className, or children, extend it rather than creating a new one
3. **Compose, don't duplicate** — Build new functionality by composing existing components
4. **Only create new components when necessary** — Only if no existing component can meet the requirement after extension attempts

### Component API Conventions

- Interactive components use 'use client' directive
- Presentational-only components should be Server Components
- Components expose refs via orwardRef where appropriate
- All components accept className prop merged via cn() for external styling
- Variants controlled through ariant and size props

### Available Components Catalog

| Component | Variants | Key Props |
|-----------|----------|-----------|
| Button | primary, ghost, danger, success | variant, size (sm/md/lg), leftIcon, rightIcon |
| Card | none, lift, glow | hover, padding (sm/md/lg) |
| Input | — | leftIcon, error, forwardRef |
| Badge | published, draft | variant |
| Chip | — | active, onClick |
| Modal | — | open, onClose, title |
| SearchBox | — | placeholder, value, onChange |
| Tabs | — | tabs, activeId, onChange |
| Carousel | — | items, autoPlay, interval |
| Reveal | — | delay (d1-d5) |

---

## Development Guidelines

### Data Layer

- Current storage: JSON files in data/ directory
- Access through Repository pattern (src/lib/data/)
- API routes (src/app/api/) handle CRUD via HTTP
- To migrate to a database: only modify the Repository layer; API routes and pages need no changes

### Internationalization

- Use useI18n() hook: returns { t, lang, setLang, isZh }
- Add new strings to BOTH src/lib/i18n/zh.ts and en.ts
- Language preference stored in cookie: pp:lang
- The root layout wraps everything in I18nProvider

### Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| default | >1024px | 3-column grids, full navigation |
| lg | <=1024px | 2-column grids |
| md | <=768px | Hamburger menu, sidebar horizontal scroll |
| sm | <=640px | Single column stacked layout |

### Styling Conventions

- Prefer Tailwind utility classes for standard styling
- Use inline style={} or CSS Modules (.module.css) for complex effects (gradients, animations, pseudo-elements)
- Global styles and CSS variables live in src/app/globals.css
- Use cn() from @/lib/cn for className merging

### Authentication

- Admin panel protected by cookie dmin_auth=1
- Login endpoint: POST /api/auth with { username, password }
- Default credentials: dmin / fcec2024
- Admin layout has auth guard: redirects to /login if not authenticated

### Build & Development Commands

`ash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # ESLint check
`

### Route Map

| Route | Type | Description |
|-------|------|-------------|
| / | Static | Home page |
| /products | Static | Product catalog |
| /products/[id] | Dynamic | Product detail |
| /login | Static | Login page |
| /admin | Static | Admin dashboard |
| /admin/products | Static | Product CRUD management |
| /admin/categories | Static | Category management |
| /design-system | Static | Design system preview (dev only) |
| /api/products | Dynamic | Products API |
| /api/categories | Dynamic | Categories API |
| /api/auth | Dynamic | Auth API |
