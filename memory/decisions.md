# القرارات التقنية — الصوت المحلي

> تم تسجيل هذه القرارات في Sprint 0 (Project Bootstrap) وتشكل الأساس المعماري للمشروع.

## 1. Next.js 15

| البند | القيمة |
|-------|--------|
| الحالة | ✅ مقرر |
| التاريخ | 2026-06-20 |
| البديل | Express.js، Remix |
| السبب | App Router، SSR، Server Components، API Routes المتكاملة، مجتمع نشط |
| النطاق | كامل المشروع (Frontend + Backend) |

## 2. TypeScript

| البند | القيمة |
|-------|--------|
| الحالة | ✅ مقرر |
| البديل | JavaScript |
| السبب | أمان نوعي، تحسين تجربة التطوير، autocompletion، تقليل أخطاء runtime |
| النطاق | كامل الكود (strict mode) |

## 3. PostgreSQL

| البند | القيمة |
|-------|--------|
| الحالة | ✅ مقرر |
| البديل | SQLite, MySQL, MongoDB |
| السبب | علاقات معقدة، JSON fields، full-text search، موثوقية عالية، دعم Vercel |
| النطاق | جميع البيانات |

## 4. Prisma

| البند | القيمة |
|-------|--------|
| الحالة | ✅ مقرر |
| البديل | Drizzle, TypeORM, Knex |
| السبب | Type-safe queries، auto-migration، مجتمع كبير، تكامل مع Next.js |
| النطاق | ORM الرئيسي |

## 5. Auth.js (NextAuth)

| البند | القيمة |
|-------|--------|
| الحالة | ✅ مقرر |
| البديل | Clerk، Lucia، JWT يدوي |
| السبب | مفتوح المصدر، Credentials + OAuth providers، تكامل Next.js، RBAC مدمج |
| النطاق | مصادقة + تفويض + إدارة الجلسات |

## 6. TailwindCSS

| البند | القيمة |
|-------|--------|
| الحالة | ✅ مقرر |
| البديل | Bootstrap، CSS Modules، Styled Components |
| السبب | تطوير سريع، utility-first، responsive، تكامل shadcn |
| النطاق | جميع الواجهات |

## 7. shadcn/ui

| البند | القيمة |
|-------|--------|
| الحالة | ✅ مقرر |
| البديل | Material UI، Chakra، Radix يدوي |
| السبب | مكونات جاهزة قابلة للتخصيص، مبنية على Radix + Tailwind، مفتوحة المصدر |
| النطاق | مكونات واجهة المستخدم |

## 8. Supabase Storage

| البند | القيمة |
|-------|--------|
| الحالة | ✅ مقرر |
| البديل | AWS S3، Cloudinary، مباشر على Vercel |
| السبب | تكامل مع PostgreSQL، CDN مدمج، RBAC على الملفات، طبقة مجانية سخية |
| النطاق | رفع وتخزين الملفات والصور |

## 9. Vercel

| البند | القيمة |
|-------|--------|
| الحالة | ✅ مقرر |
| البديل | HostingGuru، Render، Netlify |
| السبب | نشر تلقائي من GitHub، serverless functions، CDN عالمي، تكامل Next.js |
| النطاق | استضافة الإنتاج |

## 10. Prisma Connect: Accelerate → Direct TCP (Driver Adapter)

| البند | القيمة |
|-------|--------|
| الحالة | ✅ مقرر |
| التاريخ | 2026-06-21 |
| البديل | accelerateUrl مع prisma+postgres:// proxy (مواطن الخلل) |
| السبب | prisma dev proxy لا يدعم HTTP مع Prisma Client v7.8.0 (يُقبل حتى v7.2.0 فقط)، لذا نستخدم @prisma/adapter-pg مع اتصال PostgreSQL مباشر على المنفذ 51217 |
| النطاق | src/lib/prisma.ts، prisma/seed.ts، .env |
| التفاصيل | DATABASE_URL تغيّر من `prisma+postgres://localhost:51213/...` إلى `postgres://postgres:postgres@localhost:51217/template1?...` — و PrismaClient يستخدم `{ adapter }` بدلاً من `{ accelerateUrl }` |
