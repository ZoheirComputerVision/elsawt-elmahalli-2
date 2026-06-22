# خارطة طريق MVP — الصوت المحلي

الهدف: إطلاق النسخة الأولى من المنصة الإعلامية الجهوية.

---

## Phase 1: Authentication & RBAC

**الهدف**: نظام مصادقة كامل مع صلاحيات الأدوار.

| المكون | التقنية |
|--------|---------|
| تسجيل/دخول | Auth.js (Credentials) |
| إدارة الجلسات | Auth.js + JWT |
| الأدوار | Admin / Editor / Author / User |
| واجهات | shadcn/ui (LoginForm, etc.) |
| قاعدة بيانات | Prisma → User + Session tables |

**التسليم**: 3 صفحات (تسجيل دخول، ملف شخصي، إدارة مستخدمين)

---

## Phase 2: News Management

**الهدف**: نظام إدارة الأخبار كامل (CRUD + نشر + تصنيف).

| المكون | التقنية |
|--------|---------|
| API | Next.js API Routes (App Router) |
| CRUD | Server Actions + Prisma |
| الصور | Supabase Storage |
| واجهات | shadcn/ui (DataTable, Form, Editor) |

**التسليم**: لوحة تحكم الأخبار + صفحة عرض عامة

---

## Phase 3: Categories

**الهدف**: نظام تصنيفات مرن (10 تصنيفات محلية).

| المكون | التقنية |
|--------|---------|
| API | Next.js API Routes |
| CRUD | Server Actions + Prisma |
| الواجهة | shadcn/ui (TreeView, Badge) |

**التسليم**: إدارة التصنيفات + تصفية الأخبار حسب التصنيف

---

## Phase 4: Search

**الهدف**: محرك بحث نصي متكامل.

| المكون | التقنية |
|--------|---------|
| البحث | PostgreSQL Full-Text Search |
| API | Next.js API Routes |
| الواجهة | shadcn/ui (SearchInput, Results) |

**التسليم**: شريط بحث + نتائج متجاوبة

---

## Phase 5: Economic Directory

**الهدف**: دليل اقتصادي للشركات والمؤسسات المحلية.

| المكون | التقنية |
|--------|---------|
| API | Next.js API Routes |
| CRUD | Server Actions + Prisma |
| الواجهة | shadcn/ui (DirectoryCard, Map) |

**التسليم**: دليل قابل للبحث + إدارة الدليل

---

## Phase 6: Advertising

**الهدف**: نظام إعلانات مع 6 مناطق إعلانية.

| المكون | التقنية |
|--------|---------|
| API | Next.js API Routes |
| الإعلانات | Prisma + Server Actions |
| التتبع | صفحات المتابعة |
| الواجهة | shadcn/ui (AdSlots, Dashboard) |

**التسليم**: لوحة إعلانات + عرض في الصفحة الرئيسية

---

## Phase 7: Analytics

**الهدف**: لوحة تحليلات وإحصائيات متكاملة.

| المكون | التقنية |
|--------|---------|
| API | Next.js API Routes |
| البيانات | Prisma Aggregations |
| الواجهة | shadcn/ui (Charts, Stats Cards) |

**التسليم**: لوحة تحليلات مع رسوم بيانية وتقارير

---

## جدول زمني تقديري

| المرحلة | المدة المقدرة | الأولوية |
|---------|---------------|----------|
| Phase 1: Auth & RBAC | 3-4 أيام | 🔴 عالية |
| Phase 2: News | 5-7 أيام | 🔴 عالية |
| Phase 3: Categories | 2-3 أيام | 🟡 متوسطة |
| Phase 4: Search | 3-4 أيام | 🟡 متوسطة |
| Phase 5: Directory | 4-5 أيام | 🟢 منخفضة |
| Phase 6: Ads | 3-4 أيام | 🟢 منخفضة |
| Phase 7: Analytics | 3-4 أيام | 🟢 منخفضة |

**المجموع التقديري**: 23-31 يوماً
