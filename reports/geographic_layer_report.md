# Geographic Layer Foundation — تقرير Sprint 1.8

**التاريخ**: 2026-06-22  
**الإصدار**: v1.1.0  
**المرحلة**: `GEOGRAPHIC_LAYER`  
**العلامة**: `v1.0-strategic-baseline` → `sprint-auth-rbac`  
**الحالة**: ✅ مكتمل

---

## النماذج المضافة (Prisma)

### Wilaya (ولاية)

| الحقل | النوع | الوصف |
|-------|------|-------|
| `id` | String (cuid) | المعرف الفريد |
| `name` | String @unique | اسم الولاية |
| `slug` | String @unique | المعرف الرقمي |
| `code` | Int @unique | رمز الولاية (رقم) |
| `active` | Boolean | الحالة (نشط/موقوف) |
| `dairas` | Daira[] | الدوائر التابعة |

### Daira (دائرة)

| الحقل | النوع | الوصف |
|-------|------|-------|
| `id` | String (cuid) | المعرف الفريد |
| `name` | String | اسم الدائرة |
| `slug` | String | المعرف الرقمي |
| `wilayaId` | String (FK → Wilaya) | الولاية التابعة لها |
| `active` | Boolean | الحالة |
| `communes` | Commune[] | البلديات التابعة |

### Commune (بلدية)

| الحقل | النوع | الوصف |
|-------|------|-------|
| `id` | String (cuid) | المعرف الفريد |
| `name` | String | اسم البلدية |
| `slug` | String | المعرف الرقمي |
| `dairaId` | String (FK → Daira) | الدائرة التابعة لها |
| `active` | Boolean | الحالة |
| `news` | News[] | الأخبار المرتبطة |
| `directories` | DirectoryEntry[] | قيود الدليل الاقتصادي |
| `ads` | Ad[] | الإعلانات |
| `reporters` | User[] | المراسلون |

---

## العلاقات

```
Wilaya (ولاية)
  └── Daira (دائرة)
        └── Commune (بلدية)
              ├── News (أخبار)
              ├── Directory (دليل اقتصادي)
              ├── Ads (إعلانات)
              └── User (مراسلون)
```

العقود الفريدة:
- `@@unique([wilayaId, slug])` على Daira
- `@@unique([dairaId, slug])` على Commune

---

## Seeder

### ولاية تيارت (الرمز: 14)

| الدائرة | البلديات |
|---------|----------|
| تيارت | تيارت |
| السوقر | السوقر، سيدي حسني، سيدي سليمان، سيدي علي ملال |
| فرندة | فرندة، عين الحديد |
| عين الذهب | عين الذهب، شحيمة، تاقدمت |
| الرحوية | الرحوية، قرطوفة |
| مهدية | مهدية، سبعين، سيدي بختي |
| حمادية | حمادية، بوقرة |
| مدروسة | مدروسة، سيدي عبد الرحمن |
| مشرع الصفا | مشرع الصفا، جيلالي بن عمار، تيدة |
| سيدي علي ملال | سيدي علي ملال، تيدسي، سيدي بوزكري |
| سبعين | سبعين، سيدي حسني |
| قصر الشلالة | قصر الشلالة، عصفور، سطايحة |
| زمالة الأمير عبد القادر | زمالة الأمير عبد القادر |
| عين كرمس | عين كرمس، مليانة، النعيمة |

**الإجمالي**: 14 دائرة · 34 بلدية

---

## الصفحات الجديدة

| المسار | النوع | الوصف |
|--------|------|-------|
| `/admin/wilayas` | صفحة عميل (Client) | CRUD كامل للولايات |
| `/admin/dairas` | صفحة عميل (Client) | CRUD كامل للدوائر مع فلتر حسب الولاية |
| `/admin/communes` | صفحة عميل (Client) | CRUD كامل للبلديات مع فلتر حسب الدائرة |

---

## API Routes

| الطريقة | المسار | الصلاحية | الوصف |
|---------|--------|----------|-------|
| GET | `/api/geographic/wilayas` | عام | قائمة الولايات |
| GET | `/api/geographic/wilayas/[id]` | عام | تفاصيل ولاية مع دوائرها |
| POST | `/api/geographic/wilayas` | ADMIN | إنشاء ولاية |
| PUT | `/api/geographic/wilayas/[id]` | ADMIN | تحديث ولاية |
| DELETE | `/api/geographic/wilayas/[id]` | ADMIN | حذف ولاية |
| GET | `/api/geographic/dairas` | عام | قائمة الدوائر (`?wilayaId=`) |
| GET | `/api/geographic/dairas/[id]` | عام | تفاصيل دائرة مع بلدياتها |
| POST | `/api/geographic/dairas` | ADMIN | إنشاء دائرة |
| PUT | `/api/geographic/dairas/[id]` | ADMIN | تحديث دائرة |
| DELETE | `/api/geographic/dairas/[id]` | ADMIN | حذف دائرة |
| GET | `/api/geographic/communes` | عام | قائمة البلديات (`?dairaId=`) |
| GET | `/api/geographic/communes/[id]` | عام | تفاصيل بلدية |
| POST | `/api/geographic/communes` | ADMIN | إنشاء بلدية |
| PUT | `/api/geographic/communes/[id]` | ADMIN | تحديث بلدية |
| DELETE | `/api/geographic/communes/[id]` | ADMIN | حذف بلدية |
| GET | `/api/geographic/stats` | عام | إحصائيات (عدد الولايات/الدوائر/البلديات) |

---

## الـ Dashboard

تمت إضافة 3 بطاقات إحصائية جديدة في `/admin`:
- **الولايات**: عدد الولايات النشطة
- **الدوائر**: عدد الدوائر
- **البلديات**: عدد البلديات

---

## الأمن (RBAC)

- **ADMIN فقط**: إنشاء، تعديل، حذف للولايات/الدوائر/البلديات
- **EDITOR**: قراءة فقط (يستطيع عرض البيانات عبر API)
- **REPORTER**: لا يمكنه الوصول إلى صفحات الإدارة الجغرافية

---

## إحصائيات البنية

| البند | القيمة |
|-------|--------|
| Framework | Next.js 16.2.9 |
| المسارات | 36 route (+9 عن Sprint 1.7) |
| TypeScript | Clean |
| وقت البناء | 44s |
| قاعدة البيانات | PostgreSQL (صحية) |
| Prisma Models | 14 (جديد: Wilaya, Daira, Commune) |
| بيانات التجربة | 1 ولاية · 14 دائرة · 34 بلدية |

---

## الملفات الجديدة

- `prisma/migrations/20260622214003_add_geographic_models/`
- `src/features/geographic/types/index.ts`
- `src/features/geographic/repositories/index.ts`
- `src/features/geographic/index.ts`
- `src/app/admin/wilayas/page.tsx`
- `src/app/admin/dairas/page.tsx`
- `src/app/admin/communes/page.tsx`
- `src/app/api/geographic/wilayas/route.ts`
- `src/app/api/geographic/wilayas/[id]/route.ts`
- `src/app/api/geographic/dairas/route.ts`
- `src/app/api/geographic/dairas/[id]/route.ts`
- `src/app/api/geographic/communes/route.ts`
- `src/app/api/geographic/communes/[id]/route.ts`
- `src/app/api/geographic/stats/route.ts`

## الملفات المعدلة

- `prisma/schema.prisma` — إضافة Wilaya, Daira, Commune + روابط مع News, DirectoryEntry, Ad, User
- `prisma/seed.ts` — إضافة بيانات ولاية تيارت
- `src/app/admin/layout.tsx` — إضافة روابط الولايات/الدوائر/البلديات
- `src/app/admin/page.tsx` — إضافة 3 بطاقات إحصائية جغرافية
