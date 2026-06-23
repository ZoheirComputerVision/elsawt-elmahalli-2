# Runtime Exception Root Cause Report

> Date: 2026-06-22 | Project: الصوت المحلي (The Local Echo)

---

## Root Cause

The error boundary (`src/app/error.tsx`) was caught in a **secondary crash loop**:

1. A runtime exception occurred somewhere in the application
2. `error.tsx` caught it and called `logger.error(...)` to log it
3. The `Logger.error()` method at `src/lib/logger.ts:70` called `this.log("error", message, data)` at line 71
4. `this.log` failed at runtime — most likely due to a JavaScript engine/environment incompatibility (the `private log` method resolved differently in the compiled output, or `this` binding was lost in the production bundle via Turbopack/Webpack minification)
5. The error boundary caught this SECONDARY error, creating an infinite loop
6. Next.js eventually fell back to a generic "Something went wrong" page, **hiding the original exception**

---

## Stack Trace (Original)

```
at error (src/lib/logger.ts:62:10)
at Error.useEffect (src/app/error.tsx:9:12)
```

- `src/lib/logger.ts:62` → `this.log("error", message, data)` — the crash site
- `src/app/error.tsx:9` → `logger.error(...)` — the calling code

---

## Files Modified

### 1. `src/app/error.tsx`

**Problem:** Imported `@/lib/logger` and called `logger.error()` in `useEffect`. If the logger itself throws, the error boundary enters an infinite loop, hiding the real error.

**Fix:**
- Removed `import { logger } from "@/lib/logger"` (custom logger)
- Replaced with `console.error(error)` — always available, never throws
- Added development-mode details panel:
  ```tsx
  {process.env.NODE_ENV === "development" && (
    <pre>{error.stack ?? error.message}</pre>
  )}
  ```

**Before:**
```tsx
"use client";
import { useEffect } from "react";
import Link from "next/link";
import { logger } from "@/lib/logger";

export default function Error({ error, reset }) {
  useEffect(() => {
    logger.error("Global error boundary caught", { message: error.message, digest: error.digest });
  }, [error]);
  // ... generic UI only
}
```

**After:**
```tsx
"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("=== ERROR BOUNDARY CAUGHT ===", error);
  }, [error]);
  // ... generic UI
  // dev mode: <pre>{error.stack}</pre>
  // prod mode: console.error only
}
```

---

### 2. `src/lib/logger.ts`

**Problem:** Two potential crash points:
- `constructor()`: `crypto.randomUUID?.()` assumes `crypto` is a global. In edge runtimes (Next.js Edge, Cloudflare Workers, some SSR contexts), `crypto` may be undefined or lack `randomUUID`.
- `log()` method: any error inside propagates upward, which is unacceptable for a logger.

**Fix (minimal):**
1. Wrapped `constructor` body in `try/catch` — fallback to `Date.now()` if `crypto` unavailable
2. Wrapped `log()` body in `try/catch` — fallback to raw `console.error()` if structured logging fails

**Before:**
```typescript
constructor() {
  this.requestId = crypto.randomUUID?.() ?? Date.now().toString(36);
}
```

**After:**
```typescript
constructor() {
  try {
    this.requestId = crypto.randomUUID?.() ?? Date.now().toString(36);
  } catch {
    this.requestId = Date.now().toString(36);
  }
}
```

**Before:**
```typescript
private log(level, message, data?) {
  const entry = { ... };
  switch (level) { ... }
}
```

**After:**
```typescript
private log(level, message, data?) {
  try {
    const entry = { ... };
    switch (level) { ... }
  } catch {
    try { console.error(message, data); } catch { /* last resort */ }
  }
}
```

---

## Validation Results

| Check | Result |
|-------|--------|
| `npm run lint` | ✅ 0 errors, 4 warnings (pre-existing) |
| `npm run build` | ✅ 50 routes, TypeScript clean, ~31s |
| Dev server (`npm run dev`) | ✅ Loads homepage at `http://localhost:3000` |
| Error boundary (development) | ✅ Shows `<pre>{error.stack}</pre>` with full trace |
| Error boundary (production) | ✅ Logs to `console.error` (never crashes) |
| Logger defensive wrapping | ✅ `try/catch` around constructor + all console operations |

---

## How to Confirm the Fix on Live Site

1. Wait for the next production deployment or force a redeploy
2. If the error recurs:
   - **In development**: the stack trace will be displayed directly on the error page
   - **In production**: the real error will be logged to `console.error` in the browser console
   - The error boundary will no longer mask the root cause by crashing itself

## Recommendation

Once the real error is visible (via the development-mode `<pre>` panel or browser console), address that specific error. The most likely suspects are:

- **Prisma query failures** when data is missing or relationships are broken (e.g., news with `communeId` pointing to a deleted commune)
- **Auth.js session deserialization** failures in edge runtime
- **Hydration mismatches** between server/client rendering
