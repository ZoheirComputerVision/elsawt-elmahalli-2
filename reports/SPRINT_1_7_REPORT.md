# تقرير Sprint 1.7 — الصوت المحلي

## التاريخ
2026-06-22 — 2026-06-22

## الإنجازات

### 1. حماية جميع API Routes
- ✅ `api/news` — POST (REPORTER+)
- ✅ `api/news/[slug]` — PUT (EDITOR+ مع انتقالات الحالة), DELETE (ADMIN)
- ✅ `api/media` — POST (EDITOR+), GET (public)
- ✅ `api/media/[id]` — DELETE (ADMIN)
- ✅ `api/directory` — POST (EDITOR+), GET (public)
- ✅ `api/directory/[id]` — PUT (EDITOR+), DELETE (ADMIN)
- ✅ `api/ads` — POST (EDITOR+), GET (public)
- ✅ `api/ads/[id]` — PUT (EDITOR+), DELETE (ADMIN)
- ✅ `api/news/search` — GET (public)

### 2. أمن المسار (Admin)
- ✅ إضافة `auth()` + `redirect("/login")` إلى `(admin)/layout.tsx`

### 3. Dashboard Analytics
- ✅ بطاقات إحصائية (إجمالي، منشور، مراجعة، معتمد، مسودة، مؤرشف)
- ✅ رسم بياني للأخبار لكل يوم (آخر 14 يوم)
- ✅ رسم بياني للأخبار لكل تصنيف
- ✅ رسم بياني للأخبار لكل منطقة
- ✅ خط الإنتاج التحريري

### 4. Media Library
- ✅ رفع ملفات مع التحقق من النوع والحجم
- ✅ معرض صور مع إمكانية البحث
- ✅ نسخ رابط الملف
- ✅ حذف الملفات
- ✅ `/admin/media` — صفحة إدارة كاملة

### 5. Search Engine
- ✅ `/api/news/search?q=...` — بحث في العنوان، الملخص، المحتوى، الوسوم
- ✅ `/search` — صفحة بحث كاملة مع ترقيم الصفحات
- ✅ `/api/news/search?q=...&page=...&limit=...`

### 6. SEO
- ✅ `/sitemap.xml` — خرائط الموقع
- ✅ `/rss.xml` — تغذية RSS
- ✅ `/robots.txt`

### 7. Editorial Workflow
- ✅ 5 حالات: مسودة ← مراجعة ← معتمد ← منشور ← مؤرشف
- ✅ انتقالات الحالة مع RBAC (REPORTER ← EDITOR ← ADMIN)
- ✅ تسجيل كل تغيير حالة في Audit Log

### 8. الدليل الاقتصادي (Economic Directory)
- ✅ Prisma model `DirectoryEntry`
- ✅ Feature كامل (types, schemas, repository, service)
- ✅ API CRUD (`/api/directory`, `/api/directory/[id]`)
- ✅ صفحة إدارة (`/admin/directory`) مع إضافة، تعديل، حذف، بحث

### 9. إدارة الإعلانات (Ads Manager)
- ✅ Prisma model `Ad`
- ✅ Feature كامل (types, schemas, repository, service)
- ✅ API CRUD (`/api/ads`, `/api/ads/[id]`)
- ✅ صفحة إدارة (`/admin/ads`) مع إضافة، تعديل، حذف، بحث

### 10. Audit Dashboard
- ✅ `/admin/audit` — عرض سجل التدقيق الكامل
- ✅ تصنيف الإجراءات بالعربية
- ✅ عرض المستخدم، التاريخ، التفاصيل

### 11. Reporter Workspace
- ✅ `/admin/workspace` — مساحة عمل مركزة للمراسلين
- ✅ إحصائيات خاصة بكل مراسل
- ✅ قائمة بأخبار المراسل مع الحالة

## إحصائيات البنية

| البند | القيمة |
|-------|--------|
| Framework | Next.js 16.2.9 |
| المسارات | 27 route (17 dynamic, 10 static) |
| TypeScript | Clean |
| وقت البناء | 15.4s |
| قاعدة البيانات | PostgreSQL (صحية) |
| Prisma Models | 9 (Region, Category, News, Tag, NewsTag, Media, User, AuditLog, DirectoryEntry, Ad) |

## الملفات الجديدة

- `prisma/schema.prisma` — إضافة DirectoryEntry + Ad models
- `src/features/directory/` — feature كامل (types, schemas, repository, service)
- `src/features/ads/` — feature كامل (types, schemas, repository, service)
- `src/app/api/directory/` — API routes
- `src/app/api/ads/` — API routes
- `src/app/admin/directory/page.tsx` — صفحة إدارة الدليل
- `src/app/admin/ads/page.tsx` — صفحة إدارة الإعلانات
- `src/app/admin/audit/page.tsx` — لوحة التدقيق
- `src/app/admin/workspace/page.tsx` — مساحة عمل المراسل
- `src/app/search/page.tsx` — صفحة البحث
- `src/app/sitemap.xml/route.ts` — خريطة الموقع
- `src/app/rss.xml/route.ts` — RSS feed
- `src/app/robots.txt/route.ts` — robots.txt
- `src/app/api/news/search/route.ts` — API البحث
- `src/app/api/media/route.ts` — API رفع الملفات
- `src/app/api/media/[id]/route.ts` — API حذف الملفات

## التعديلات على الملفات الموجودة

- `src/app/(admin)/layout.tsx` — إضافة auth check
- `src/app/admin/layout.tsx` — إضافة روابط التنقل الجديدة
- `src/features/news/api/response.ts` — توسيع `ok()` لدعم meta
- `src/components/news/NewsTable.tsx` — إضافة حالات 5
- `src/components/news/NewsForm.tsx` — إضافة حالات 5
- `src/app/api/news/[slug]/route.ts` — إضافة انتقالات الحالة مع RBAC

## الخطوات القادمة (Sprint 1.8)

1. Supabase Storage للوسائط بدلاً من الملفات المحلية
2. Frontend public للدليل الاقتصادي
3. Frontend public للإعلانات
4. تحسينات SEO إضافية
5. اختبارات E2E
6. تحسين أداء الصفحة الرئيسية
