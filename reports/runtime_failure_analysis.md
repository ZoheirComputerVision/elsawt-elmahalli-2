# Runtime Failure Investigation Report — Sprint 1.1A

## 1. Root Cause

**Prisma Postgres local proxy is not running on `localhost:51213`.**

The `PrismaClient` configured with `accelerateUrl` pointing to a `prisma+postgres://localhost:51213/` endpoint makes internal HTTP `fetch()` calls to the local Prisma Postgres proxy. When that proxy isn't running, the connection is refused (`ECONNREFUSED`), surfacing as `TypeError: fetch failed` wrapped in `AggregateError`.

## 2. Evidence

### Stack Trace (from build output)

```
Error [PrismaClientInitializationError]: `PrismaClient` needs to be constructed with
a non-empty, valid `PrismaClientOptions`
```

*(This was the earlier build error before `accelerateUrl` was added.)*

After adding `accelerateUrl`:

```
TypeError: fetch failed
  clientVersion: '7.8.0',
  [cause]: AggregateError:
    code: 'ECONNREFUSED',
    [errors]: [ [Error], [Error] ]
```

The `AggregateError` with multiple `ECONNREFUSED` errors is the hallmark of an HTTP client (undici/node-fetch) failing to connect to a TCP endpoint — in this case the Prisma Postgres proxy.

### Connection String

`.env` → `DATABASE_URL`:

```
prisma+postgres://localhost:51213/?api_key=...
```

This is a **Prisma Postgres** URL. The scheme `prisma+postgres://` tells the Prisma client to make HTTP requests to a local proxy daemon at `localhost:51213`. The proxy is started by running `npx prisma dev`.

### No `fetch()` in Application Code

```
grep for fetch() in src/ → 0 results
```

All data access goes through Prisma queries. The `fetch` call is internal to `@prisma/client/runtime` when using `accelerateUrl`.

## 3. Affected Files

| File | Line | Operation | Suspicion |
|------|------|-----------|-----------|
| `src/lib/prisma.ts` | 7 | `new PrismaClient({ accelerateUrl })` | Primary — constructs client that connects to `localhost:51213` |
| `src/features/news/queries.ts` | 10–26 | 5 direct `prisma.news.findMany()` calls | Executes queries that trigger the HTTP connection |
| `src/app/page.tsx` | 20–28 | 8 `await` calls to query functions | All fail because `prisma` can't connect |

## 4. Connectivity Map

```
page.tsx (async Server Component)
  → queries.ts
    → prisma.news.findMany()         ← bypasses repository layer
      → PrismaClient (lib/prisma.ts)
        → accelerateUrl (prisma+postgres://localhost:51213)
          → HTTP fetch to localhost:51213  ← 🛑 ECONNREFUSED
            → AggregateError: fetch failed
```

## 5. Secondary Finding: Repository Layer Bypass

`src/features/news/queries.ts` calls `prisma.news.findMany()` **directly** instead of going through `newsRepository`. This:
- Violates the project architecture rule *"No direct Prisma calls from Route Handlers"* (though queries is imported by a Server Component, not a Route Handler)
- Bypasses the `include` definition used in the repository (queries uses a slightly different `include` without `tags`)
- Creates a second code path for the same data access pattern

This is **not** the cause of the runtime failure, but it's a structural concern.

## 6. Recommended Fix

Start the Prisma Postgres local proxy:

```powershell
npx prisma dev
```

This launches the local proxy daemon on `localhost:51213` which tunnels to the cloud Postgres database embedded in the `DATABASE_URL`'s `api_key` parameter.

**No code changes required.** The error is environmental, not logical.

## 7. Risk Level

**Medium.**

- No data loss risk
- No code regression risk
- Blocked until the proxy is running
- If deployment uses a direct PostgreSQL connection string (standard `postgresql://`), the `prisma.ts` file would need to switch from `accelerateUrl` to a driver adapter (`@prisma/adapter-pg`)

## 8. Verification

After running `npx prisma dev`:
1. `npx next build` should pass all stages (compile → TS → data collection → page generation)
2. `npm run dev` should render `/` without errors
3. API routes (`/api/news`, `/api/news/[slug]`) should respond correctly

## 9. Files That Do NOT Need Changes

- `src/app/page.tsx` — logic correct
- `src/app/api/news/*` — logic correct
- `src/features/news/services/*` — logic correct
- `src/features/news/repositories/*` — logic correct
- `src/components/features/*` — all handle null/empty data with fallbacks
- `prisma/schema.prisma` — schema valid
- `.env` — connection string valid
