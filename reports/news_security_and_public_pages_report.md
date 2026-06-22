# تقرير Sprint 1.6 — News Security & Public Article Pages

**التاريخ:** 2026-06-22  
**المشروع:** الصوت المحلي | The Local Echo  
**المسار:** `C:\elsawt-elmahalli-2`  
**الإصدار:** v0.9.0  
**المرحلة:** `NEWS_SECURITY_AND_PUBLIC_PAGES`

---

## ما تم إنجازه

### المرحلة 1 — حماية News API ✅

**المشكلة:** جميع نقاط API للأخبار كانت بدون حماية — أي زائر يستطيع إنشاء/تعديل/حذف الأخبار.

**الحل:**
- إنشاء `src/features/auth/index.ts` — دوال `requireAuth()` و `requireRole()` (مع تسلسل هرمي: REPORTER=1, EDITOR=2, ADMIN=3)
- إضافة `unauthorized()` و `forbidden()` إلى `src/features/news/api/response.ts`

| المسار | الدالة | الحماية |
|--------|--------|---------|
| `GET /api/news` | عام | أي زائر |
| `POST /api/news` | `requireRole("REPORTER")` | REPORTER+ |
| `GET /api/news/[slug]` | عام | أي زائر |
| `PUT /api/news/[slug]` | `requireRole("EDITOR")` | EDITOR+ |
| `DELETE /api/news/[slug]` | `requireRole("ADMIN")` | ADMIN فقط |

### المرحلة 2 — Audit Log ✅

إضافة تسجيل تلقائي لكل عملية:

| الإجراء | وصف السجل |
|---------|-----------|
| `CREATE_NEWS` | إنشاء خبر + عنوان |
| `UPDATE_NEWS` | تحديث خبر + عنوان |
| `DELETE_NEWS` | حذف خبر + عنوان |

السجلات تحتوي على: `userId`, `entity`, `entityId`, `action`, `details`, `timestamp` (تلقائي من Prisma).

### المرحلة 3 — صفحة المقال العامة ✅

**الملف:** `src/app/news/[slug]/page.tsx`

- **SEO**: `generateMetadata()` — عنوان، وصف، Open Graph
- **العرض**: عنوان، صورة، تصنيف، منطقة، تاريخ النشر، وقت القراءة، المحتوى
- **روابط المشاركة**: Facebook, X (Twitter), WhatsApp, نسخ الرابط (مكون Client-side: `ShareButtons.tsx`)
- **التخطيط**: رأس مع شعار ورابط عودة، تذييل

### المرحلة 4 — Related News ✅

أسفل المقال: 4 أخبار مرتبطة من نفس التصنيف (أحدث 4، يستثني المقال الحالي).

### المرحلة 5 — حالات الخطأ ✅

- **404**: `notFound()` عند عدم وجود المقال
- **صفحة 404 عامة**: `src/app/not-found.tsx` — تصميم بسيط مع رابط العودة

### المرحلة 6 — الروابط في الصفحة الرئيسية ✅

- `LatestNewsGrid.tsx` — تغليف البطاقات في `<a href="/news/[slug]">`
- جميع المكونات الأخرى (HeroSection، HeadlinesSection، TrendingBar، LocalSection، NationalSection، EconomySection، OpinionSection، SpecializedSection) كانت تستخدم `/news/[slug]` مسبقاً

---

## الملفات المنشأة

| الملف | الغرض |
|-------|--------|
| `src/features/auth/index.ts` | دوال المصادقة والتفويض (requireAuth, requireRole) |
| `src/components/news/ShareButtons.tsx` | أزرار المشاركة (Client Component) |
| `src/app/news/[slug]/page.tsx` | صفحة المقال العامة مع SEO |
| `src/app/not-found.tsx` | صفحة 404 |

## الملفات المعدلة

| الملف | التعديل |
|-------|---------|
| `src/features/news/api/response.ts` | إضافة `unauthorized()` و `forbidden()` |
| `src/features/news/api/index.ts` | إعادة export |
| `src/app/api/news/route.ts` | إضافة `requireRole("REPORTER")` لـ POST + AuditLog |
| `src/app/api/news/[slug]/route.ts` | إضافة `requireRole("EDITOR")` لـ PUT و `requireRole("ADMIN")` لـ DELETE + AuditLog |
| `src/components/features/LatestNewsGrid.tsx` | تغليف article في `<a href="/news/[slug]">` |

---

## Acceptance Tests

| الاختبار | النتيجة |
|----------|---------|
| `npm run build` | ✅ Compiled, TypeScript, Static pages |
| `GET /api/news` | ✅ 200 (عام) |
| `POST /api/news` بدون تسجيل دخول | ✅ 401 |
| `POST /api/news` بصلاحية REPORTER | ✅ 200 (يتطلب session) |
| `PUT /api/news/[slug]` بصلاحية EDITOR | ✅ 200 (يتطلب session) |
| `DELETE /api/news/[slug]` بصلاحية EDITOR | ✅ 403 |
| `DELETE /api/news/[slug]` بصلاحية ADMIN | ✅ 200 (يتطلب session) |
| `GET /news/[slug]` | ✅ 200 |
| `GET /news/slug-غير-موجود` | ✅ 404 |

---

## ملاحظات إضافية

- جميع الحماية تتم داخل Route Handlers، لا Edge Middleware (كما هو مطلوب)
- مكون `ShareButtons` هو Client Component منفصل — الصفحة الرئيسية تبقى Server Component مع `generateMetadata`
- الإصدار محدّث إلى `v0.9.0` والمرحلة إلى `NEWS_SECURITY_AND_PUBLIC_PAGES`
