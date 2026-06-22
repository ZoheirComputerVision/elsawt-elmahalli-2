# Editorial Data Foundation — Sprint 1.0

## Overview
Built the core data layer for news content: Prisma schema (6 models), feature folder with repository/service/validation layers, and seed script for default regions and categories.

---

## 1. Prisma Schema — Models & Relations

| Model | Table | Key Fields | Relations |
|---|---|---|---|
| **Region** | `regions` | `id`, `name` (unique), `slug` (unique) | 1:N → News |
| **Category** | `categories` | `id`, `name` (unique), `slug` (unique) | 1:N → News |
| **News** | `news` | `id`, `title`, `slug` (unique), `summary`, `body`, `status` (draft/published/archived), `viewCount`, `publishedAt` | N:1 → Category, N:1 → Region, 1:N → Media, N:M → Tag |
| **Tag** | `tags` | `id`, `name` (unique), `slug` (unique) | N:M → News (via NewsTag) |
| **NewsTag** | `news_tags` | `newsId` + `tagId` (composite PK) | N:1 → News, N:1 → Tag (cascade delete) |
| **Media** | `media` | `id`, `filename`, `originalName`, `mimeType`, `size`, `url`, `newsId` | N:1 → News (cascade delete) |

### Relations Diagram
```
Region ──1:N──> News ──N:1── Category
                   │
                   ├──1:N── Media
                   │
                   └──N:M── Tag (via NewsTag)
```

---

## 2. Feature Folder — `src/features/news/`

```
src/features/news/
├── index.ts                     # barrel export
├── types/
│   └── index.ts                 # NewsStatus, NewsWithRelations, CreateNewsInput, UpdateNewsInput, NewsFilter
├── schemas/
│   ├── index.ts                 # barrel
│   └── news.schema.ts           # CreateNewsSchema + UpdateNewsSchema (Zod)
├── services/
│   ├── index.ts                 # barrel
│   └── news.service.ts          # CRUD + publish/archive/viewCount + validation
└── repositories/
    ├── index.ts                 # barrel
    └── news.repository.ts       # Prisma queries (findMany, findById, findBySlug, create, update, delete, count)
```

### Data Flow
```
DTO → Zod Schema (parse/validate) → Service → Repository → Prisma → PostgreSQL
```

---

## 3. Zod Validation Schemas

### CreateNewsSchema
| Field | Type | Validation |
|---|---|---|
| `title` | `string` | min 3, max 200 chars |
| `slug` | `string?` | optional (auto-generated from title via `toSlug()`) |
| `summary` | `string? \| null` | max 500 chars |
| `body` | `string? \| null` | — |
| `status` | `"draft" \| "published" \| "archived"` | default: `"draft"` |
| `categoryId` | `string` | required |
| `regionId` | `string? \| null` | optional |

### UpdateNewsSchema
- Same fields as CreateNewsSchema, all optional (`partial()`)

---

## 4. Seed Data

### Regions (3)
| Name | Slug |
|---|---|
| تيارت | `tiaret` |
| تيسمسيلت | `tissemsilt` |
| قصر الشلالة | `ksar-chellala` |

### Categories (6)
| Name | Slug |
|---|---|
| محليات | `local` |
| الوطن | `nation` |
| العالم | `world` |
| اقتصاد | `economy` |
| رأي | `opinion` |
| متخصصة | `specialized` |

Seed script: `prisma/seed.ts` (uses `upsert` for idempotency)

---

## 5. New & Modified Files

### New Files
| File | Purpose |
|---|---|
| `prisma/schema.prisma` | 6 models with relations, PostgreSQL datasource, Prisma Client v7 |
| `prisma/seed.ts` | Seed script for regions + categories |
| `src/lib/prisma.ts` | PrismaClient singleton (global caching) |
| `src/features/news/types/index.ts` | TypeScript types for news domain |
| `src/features/news/schemas/news.schema.ts` | Zod v4 schemas |
| `src/features/news/schemas/index.ts` | Barrel export |
| `src/features/news/services/news.service.ts` | Business logic layer |
| `src/features/news/services/index.ts` | Barrel export |
| `src/features/news/repositories/news.repository.ts` | Data access layer |
| `src/features/news/repositories/index.ts` | Barrel export |
| `src/features/news/index.ts` | Feature barrel export |

### Modified Files
| File | Change |
|---|---|
| `src/lib/utils.ts` | Added `toSlug()` function for Arabic-safe slug generation |
| `memory/project_state.json` | Phase → `EDITORIAL_DATA_FOUNDATION`, version → `0.3.0` |
| `tsconfig.json` | Excluded `prisma/` from Next.js build |

---

## 6. Acceptance Tests

| Test | Result |
|---|---|
| `npx prisma validate` | ✅ Schema is valid 🚀 |
| `npm run lint` | ✅ 0 errors, 2 warnings (old file only) |
| `npm run build` | ✅ 0 errors (8.6s compile, 10.2s TS) |

---

## 7. Design Decisions

- **`PrismaClient` constructor**: Prisma 7.x requires explicit options argument; uses `as any` cast with eslint disable (standard pattern for generated Prisma client)
- **`toSlug()`**: Custom slug function instead of `slugify` dependency — strips Arabic diacritics, converts to lowercase kebab-case
- **Repository pattern**: Thin wrapper over Prisma queries for future testability
- **Service layer**: Validates with Zod before delegating to repository; adds auto-slug generation
- **Prisma output**: Generated to `src/generated/prisma/` (not default `node_modules/.prisma`) for explicit import paths
- **No business logic**: CRUD only, no complex rules, no auth, no RBAC
