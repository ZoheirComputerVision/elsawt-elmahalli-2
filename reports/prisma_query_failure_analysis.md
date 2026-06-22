# Prisma Query Failure Analysis — PrismaClientKnownRequestError

## 1. Root Cause

**PostgreSQL server is not running on `localhost:51217`.**

- `npx prisma migrate status` → **P1001: Can't reach database server at `localhost:51217`**
- `Get-Process -Name "postgres"` → **PostgreSQL process not found**
- `prisma/migrations/` → **empty directory** (no migrations ever applied)
- No seed command configured in `prisma.config.ts`

When `prisma.news.findMany()` executes, the `@prisma/adapter-pg` driver attempts a TCP connection to `localhost:51217`. Since no PostgreSQL instance is listening on that port, the connection is refused and Prisma throws `PrismaClientKnownRequestError` (code `P1001`).

Even if the database were running, the `news` table does not exist because no migrations have been applied — this would trigger `P2021: Table "news" does not exist` as a secondary failure.

## 2. Affected Query

| البند | القيمة |
|-------|--------|
| **File** | `src/features/news/queries.ts:10` |
| **Line** | 10–16 |
| **Full Query** | `prisma.news.findMany({ where: where as never, include: { category: true, region: true, media: true }, orderBy: { publishedAt: "desc" }, take: filter.limit ?? 20, skip: filter.offset ?? 0 })` |

## 3. Error Details

- **error.code**: `P1001` (primary — database unreachable) / `P2021` (secondary — table not found)
- **error.message**: `Can't reach database server at \`localhost:51217\``

## 4. Affected Model

```prisma
model News {
  @@map("news")  // → table "news" in PostgreSQL
}
```

## 5. Call Chain

```
src/app/page.tsx:20
  → getPublishedNews(20)                        [queries.ts:19]
    → getNews({ status: "published", limit:20 }) [queries.ts:4]
      → prisma.news.findMany({ ... })            [queries.ts:10] ← 🛑 ERROR
```

## 6. Environment Checks

| Check | Result |
|-------|--------|
| جدول News موجود؟ | ❌ — لا توجد Migrations أصلاً (`prisma/migrations/` فارغ) |
| أسماء الحقول تطابق DB؟ | ❌ — غير معروف، لم تُطبق migrations |
| Migration مطبقة؟ | ❌ — صفر migrations |
| حقل مطلوب مفقود؟ | — غير قابل للتحقق (DB غير متصلة) |
| Relation غير صالح؟ | — غير قابل للتحقق (DB غير متصلة) |
| Generated Client موجود؟ | ✅ — `src/generated/prisma/client/` |
| PostgreSQL Process؟ | ❌ — غير شغال |
| Seed مهيأ؟ | ❌ — `prisma db seed` غير مضبوط في `prisma.config.ts` |

## 7. Recommended Fix

Two issues must be resolved sequentially:

1. **Start PostgreSQL on `localhost:51217`** — either install/start a local PostgreSQL instance, or update `DATABASE_URL` in `.env` to point to a running instance.

2. **Apply migrations** — run `npx prisma migrate dev` to create the `news` table and all related tables from `schema.prisma`.

3. **Configure and run seed** — add seed command to `prisma.config.ts`:
   ```ts
   // prisma.config.ts
   exports default defineConfig({
     schema: "prisma/schema.prisma",
     migrations: { path: "prisma/migrations" },
     datasource: { url: process.env["DATABASE_URL"] },
   });
   ```

## 8. Previous Context

This is the second iteration of database connectivity issues. The earlier failure (documented in `reports/runtime_failure_analysis.md`) involved the Prisma Postgres proxy (`prisma+postgres://` scheme) which was replaced with a direct TCP connection via `@prisma/adapter-pg`. The current `.env` and `src/lib/prisma.ts` reflect that fix, but the PostgreSQL backend is not running.

## 9. Files NOT to Modify

- `src/features/news/queries.ts` — query logic is correct
- `src/features/news/repositories/news.repository.ts` — repository logic is correct
- `src/lib/prisma.ts` — adapter config is correct
- `prisma/schema.prisma` — schema is valid
- `src/app/page.tsx` — page logic is correct

**The error is environmental, not logical.**
