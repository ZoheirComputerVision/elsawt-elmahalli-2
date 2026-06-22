# الأمن — الصوت المحلي

## 1. المصادقة (Authentication)
- **NextAuth.js (Auth.js)** مع استراتيجية JWT
- **bcryptjs** لتشفير كلمات المرور
- مزود الدخول: Credentials (بريد إلكتروني + كلمة مرور)
- مدة الجلسة: 7 أيام
- صفحة الدخول: `/login`
- التوجيه بعد الدخول: `/admin`

## 2. التفويض (Authorization)
- التسلسل الهرمي للأدوار: `REPORTER(1) < EDITOR(2) < ADMIN(3)`
- `requireRole(role)` — تتحقق من أن دور المستخدم >= المستوى المطلوب
- جميع API Routes محمية بالأدوار (عدا المسارات العامة)
- مسارات `/admin/*` محمية عبر `auth()` في `layout.tsx`

## 3. قاعدة البيانات
- **PostgreSQL** عبر Prisma ORM (يمنع SQL Injection)
- 14 نموذجاً: User, News, Category, Region, Tag, NewsTag, DirectoryEntry, Ad, Media, AuditLog, Wilaya, Daira, Commune, Notification
- جميع المفاتيح الخارجية مع `onDelete: Cascade` أو `SetNull`
- الفهارس الفريدة لمنع التكرار

## 4. تحديد المعدل (Rate Limiting) — مطبق ✅

| المسار | الحد (GET) | الحد (POST/PUT/DELETE) | النافذة |
|--------|-----------|----------------------|---------|
| `/api/news/*` | 60 | 20 | 60 ثانية |
| `/api/news/search` | 30 | — | 60 ثانية |
| `/api/directory/*` | 60 | 20 | 60 ثانية |
| `/api/ads/*` | 60 | 20 | 60 ثانية |
| `/api/media/*` | 60 | 10 | 60 ثانية |
| `/api/auth/logout` | — | 10 | 60 ثانية |
| `/api/geographic/*` | 60 | 20 | 60 ثانية |

## 5. رفع الملفات
- الأنواع المسموحة: JPG, JPEG, PNG, GIF, WebP, SVG
- الحد الأقصى: 5 ميجابايت
- تسمية آمنة: `Date.now()-random.ext`
- المسار: `public/uploads/` (Supabase Storage قيد التطوير)
- حذف الملفات المادية عند الحذف من قاعدة البيانات

## 6. سجل التدقيق (Audit Log)
- جميع عمليات CREATE/UPDATE/DELETE تُسجل في جدول `auditLog`
- تسجيل كل عملية دخول للمستخدم
- تسجيل العمليات على: الأخبار، الوسائط، الدليل، الإعلانات، الجغرافيا
- يتضمن: userId, action, entity, entityId, details, timestamp

## 7. المفاتيح والبيئات
| المتغير | الوصف |
|---------|-------|
| `DATABASE_URL` | اتصال PostgreSQL |
| `AUTH_SECRET` | مفتاح JWT السري (NextAuth) |
| `NEXTAUTH_URL` | رابط الموقع |
| `SUPABASE_URL` | رابط Supabase (اختياري) |
| `SUPABASE_ANON_KEY` | مفتاح Supabase (اختياري) |

التحقق من المتغيرات البيئية في الإنتاج عبر `src/lib/env.ts`.

## 8. معالجة الأخطاء
- Error Boundary عام: `src/app/error.tsx` + `src/app/global-error.tsx`
- معالج موحد: `src/lib/errors.ts` (AppError, AuthError, ForbiddenError, NotFoundError, ValidationError)
- معالج أخطاء Prisma: `handlePrismaError()` (P2002, P2025, P2003)
- مسار الصحة: `GET /api/health` (حالة قاعدة البيانات، Prisma، التخزين)

## 9. الممارسات المحظورة
- ❌ تخزين كلمات المرور كنص صريح (bcryptjs)
- ❌ إظهار أخطاء debug في الإنتاج
- ❌ رفع ملفات قابلة للتنفيذ
- ❌ مشاركة AUTH_SECRET في الكود
- ❌ استخدام eval() أو dynamic require()
