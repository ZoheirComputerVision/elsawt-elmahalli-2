# التصميم المعماري — الصوت المحلي | The Local Echo

## 1. نظرة عامة

```
┌──────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Next.js 16)                     │
│  RSC / Client Components / TailwindCSS / shadcn/ui / RTL Layout   │
├──────────────────────────────────────────────────────────────────┤
│                     API LAYER (Next.js App Router)                │
│  /api/news / /api/directory / /api/ads / /api/media / /api/auth  │
│  RBAC middleware → auth() في الـ layouts للحماية                   │
├──────────────────────────────────────────────────────────────────┤
│                     FEATURE LAYER                                  │
│  features/ → types, schemas (Zod), repositories, services         │
│  News / Directory / Ads / Auth / Audit / Search                   │
├──────────────────────────────────────────────────────────────────┤
│                     DATA LAYER                                     │
│  PostgreSQL + Prisma ORM (type-safe queries, auto-migration)      │
│  Filesystem storage → Supabase Storage (Sprint 1.9)               │
└──────────────────────────────────────────────────────────────────┘
```

## 2. النموذج الجغرافي

```
Wilaya (ولاية)
  └── Daira (دائرة)
        └── Commune (بلدية)
              └── Correspondent (مراسل)
                    ├── News (أخبار)
                    ├── Directory (دليل اقتصادي)
                    └── Ads (إعلانات)
```

كل دائرة وبلدية تمثل وحدة تغطية مستقلة. النظام مصمم لإضافة ولايات جديدة دون إعادة هيكلة.

## 3. مسارات التطبيق

| المجموعة | المسارات | الحماية |
|----------|----------|---------|
| عامة | `/`, `/news/[slug]`, `/search` | عامة |
| (admin) | `/(admin)/news`, `/(admin)/news/create`, `/(admin)/news/[slug]/edit` | `auth()` + `redirect` |
| إدارية | `/admin`, `/admin/users`, `/admin/media`, `/admin/directory`, `/admin/ads`, `/admin/audit`, `/admin/workspace` | متداخلة في layout |
| SEO | `/sitemap.xml`, `/rss.xml`, `/robots.txt` | عامة |
| API عامة | `GET /api/news`, `GET /api/news/[slug]`, `GET /api/news/search`, `GET /api/directory`, `GET /api/ads` | عامة |
| API محمية | `POST/PUT/DELETE` للـ news, directory, ads, media | RBAC (REPORTER+/EDITOR+/ADMIN) |

## 4. سير العمل التحريري

```
مسودة (DRAFT) ← REVIEWER → مراجعة (REVIEW)
  ← EDITOR → معتمد (APPROVED)
  ← EDITOR → منشور (PUBLISHED)
  ← ADMIN → مؤرشف (ARCHIVED)
```

## 5. الأمن

- المصادقة: Auth.js (NextAuth v5) مع Credentials provider
- التفويض: RBAC بأربعة أدوار (ADMIN, EDITOR, REPORTER, READER)
- حماية المسارات: `auth()` في `(admin)/layout.tsx`
- حماية API: `requireRole()` في كل route
- سجل التدقيق: `src/lib/audit.ts` لكل عملية حساسة

## 6. التوسع المستقبلي

تم بناء المنصة لتكون متعددة الولايات بشكل طبيعي:
- إضافة `wilayaId` / `dairaId` / `communeId` إلى كل نموذج
- كل ولاية جديدة تُضاف كبيانات في جدول Wilaya
- لا حاجة لإعادة تصميم النظام عند إضافة ولاية جديدة
