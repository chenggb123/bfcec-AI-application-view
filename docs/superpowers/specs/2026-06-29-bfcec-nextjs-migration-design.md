# BFCEC AI Center — Next.js Migration Design

**Date:** 2026-06-29
**Status:** Approved
**Source:** temp/ HTML files + mqupblyy-design-system.md

---

## 1. Overview

将 `temp/` 目录下的 4 个原生 HTML 页面（首页、产品目录、产品详情、登录、管理后台）迁移为 Next.js App Router 项目，建立可维护、可复用、可扩展的前端组件体系。

## 2. Tech Stack

| 层级 | 选型 |
|------|------|
| 框架 | Next.js 14+ (App Router) |
| 样式 | Tailwind CSS + CSS 自定义属性 |
| 组件 | React Server Components 优先 |
| 数据 | API Routes → Repository → JSON 文件 |
| 国际化 | React Context (zh/en) |
| 3D | Three.js (仅首页粒子背景) |
| 鉴权 | Cookie-based session |

## 3. Directory Structure

```
src/
├── app/
│   ├── layout.tsx                 # 根布局
│   ├── page.tsx                   # 首页
│   ├── products/
│   │   ├── page.tsx               # 产品目录
│   │   └── [id]/page.tsx          # 产品详情
│   ├── login/page.tsx             # 登录
│   ├── admin/
│   │   ├── layout.tsx             # 后台布局(侧边栏)
│   │   ├── page.tsx               # 仪表盘
│   │   ├── products/page.tsx      # 产品管理
│   │   └── categories/page.tsx    # 分类管理
│   ├── design-system/page.tsx     # 设计系统预览(仅dev)
│   └── api/
│       ├── products/route.ts & [id]/route.ts
│       ├── categories/route.ts
│       └── auth/route.ts
├── components/
│   ├── ui/          # Button, Card, Input, Badge, Modal, Chip, SearchBox, Carousel, Tabs
│   ├── layout/      # Nav, Footer, Sidebar, PageHeader
│   ├── home/        # HeroSection, ParticleCanvas, CapabilityCards, StatsSection
│   ├── product/     # ProductCard, ProductGrid, ProductToolbar, BenefitCard, CompareSection, TechStack
│   └── admin/       # ProductTable, ProductEditor, StatsGrid, CategoryManager
├── lib/
│   ├── design-tokens.ts
│   ├── cn.ts
│   ├── data/        # products.ts, categories.ts, auth.ts (Repository)
│   └── i18n/        # zh.ts, en.ts, index.ts
├── hooks/           # useScrollReveal, useI18n, useAuth
└── types/index.ts
data/                # products.json, categories.json
```

## 4. Design Tokens

Colors mapped to Tailwind `brand.*`, `surface.*`, `border.*`, `text.*` namespaces.

Primary: `#DA291C` (red), background: `#0a0a0a`, surface: `#141414`.

Fonts: `font-display` (headings), `font-body`, `font-mono` stacks.

BorderRadius: `sm: 6px`, `md: 10px`, `lg: 16px`.

## 5. Core Component API

| Component | Variants | Key Props |
|-----------|----------|-----------|
| Button | primary, ghost, danger, success | variant, size, leftIcon, loading |
| Card | default | hover, padding, className |
| Input | default | leftIcon, error |
| Badge | published, draft | variant |
| Chip | default | active |
| Modal | default | open, onClose, title |
| Carousel | default | items, autoPlay |
| Tabs | default | tabs, active, onChange |

## 6. Component Reuse Rules

1. 优先用 variant + size + className 扩展已有组件
2. 其次用 children / renderProps 组合
3. 实在无法满足才新增组件

## 7. Data Flow

- Public pages: Server Components → fetch API Routes → JSON files
- Admin pages: Client Components → useProducts/useAuth hooks → fetch API Routes
- API Routes use Repository pattern, backing store is JSON files (swap to DB later)

## 8. i18n

React Context: `I18nProvider` wraps root layout, `useI18n()` hook. Language stored in cookie for SSR.

## 9. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| default | >1024px | 3-col grid, full nav |
| lg | ≤1024px | 2-col grid |
| md | ≤768px | 1-col, hamburger menu, sidebar → horizontal |
| sm | ≤640px | Stacked layout |

## 10. Pages

| Route | Type | Description |
|-------|------|-------------|
| / | Server | Hero + capabilities + featured products + stats |
| /products | Server | Filterable product grid with search |
| /products/[id] | Server | Product detail with carousel, benefits, compare |
| /login | Client | Login form |
| /admin | Client | Dashboard with stats |
| /admin/products | Client | Product CRUD table + editor modal |
| /admin/categories | Client | Category list manager |
| /design-system | Client | Dev-only design system preview |
