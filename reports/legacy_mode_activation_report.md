# تقرير تفعيل Legacy Mode — Sprint 2.5

## التاريخ
2026-06-23

## الهدف
إعادة واجهة الإدارة لتشبه منصة الصوت المحلي القديمة مع الاحتفاظ بجميع التطويرات الحديثة.

## المبدأ
- **لم يتم حذف** أي Prisma Models, API Routes, Database Tables, RBAC Rules, Business Logic.
- **تم فقط** إخفاء عناصر واجهة المستخدم مع إمكانية إعادة التفعيل لاحقاً.

## Feature Flags

**الملف:** `src/config/featureFlags.ts`

```typescript
export const FEATURE_FLAGS = {
  legacyMode: true,
  geographicFeatures: false,
  coverageAnalytics: false,
  reporterRanking: false,
  geographicSearch: false,
  auditDashboard: false,
  revenueDashboard: false,
};
```

جميع عناصر الواجهة المتقدمة تعتمد على هذه الأعلام. عند ضبط `legacyMode: false` تعود الواجهة الكاملة.

## القائمة الرئيسية الجديدة

| الرمز | العنصر | المسار |
|---|---|---|
| 📊 | الرئيسية | `/admin` |
| 📝 | مراجعة المحتوى | `/admin/review` |
| 📰 | الأخبار | `/news` |
| 🖼 | مكتبة الوسائط | `/admin/media` |
| ⭐ | الخبر الرئيسي | `/admin/featured` |
| 📢 | الأخبار العاجلة | `/admin/breaking-news` |
| 👥 | المستخدمون | `/admin/users` |
| 📋 | سجل AI | `/admin/logs` |
| ⚙️ | الإعدادات | `/admin/settings` |
| 📺 | الإعلانات | `/admin/ads` |
| 📱 | التواصل | `/admin/social` |

## العناصر المخفية

هذه الصفحات لا تزال تعمل عند الوصول إليها مباشرة بالرابط، لكنها غير ظاهرة في القائمة:

- `/admin/coverage`
- `/admin/coverage/score`
- `/admin/coverage/gaps`
- `/admin/reporters/ranking`
- `/admin/geographic/search`
- `/admin/assignments`
- `/admin/audit`
- `/admin/wilayas`
- `/admin/dairas`
- `/admin/communes`
- `/admin/newsletter`
- `/admin/contact`
- `/admin/directory`

## صفحة Dashboard الرئيسية

تم تعديل `src/app/admin/page.tsx` لعرض:

1. **بطاقات الإحصائيات الأساسية:**
   - منشور
   - للمراجعة
   - مسودات
   - مرفوض
   - مؤرشف
   - قرارات AI

2. **جدول "في انتظار المراجعة"** (العنصر المركزي كما في المنصة القديمة)

3. **الإجراءات السريعة المبسطة:**
   - `+ خبر جديد` ← `/news/create`
   - `+ خبر عاجل` ← `/admin/breaking-news`
   - `+ إعلان جديد` ← `/admin/ads`
   - `+ رفع وسائط` ← `/admin/media`

4. **آخر قرارات AI** (قائمة محدثة)

## الصفحات الجديدة

تم إنشاء 4 صفحات كانت مفقودة:

| الصفحة | الملف | الوظيفة |
|---|---|---|
| مراجعة المحتوى | `src/app/admin/review/page.tsx` | عرض الأخبار في حالة `review` مع إمكانية المراجعة |
| الخبر الرئيسي | `src/app/admin/featured/page.tsx` | اختيار الخبر البارز في الواجهة |
| سجل AI | `src/app/admin/logs/page.tsx` | عرض سجل قرارات AI بشكل منظم |
| الإعدادات | `src/app/admin/settings/page.tsx` | إعدادات الموقع الأساسية |

## التحقق النهائي

| البند | النتيجة |
|---|---|
| `npm run lint` | ✅ 0 errors, 4 warnings (مسبقة) |
| `npx next build` | ✅ ناجح — 37 صفحة بدون أخطاء |
| جميع الـ API Routes | ✅ لا تزال تعمل |
| جميع الـ Database Tables | ✅ محفوظة |
| جميع الـ Prisma Models | ✅ محفوظة |
| جميع الـ RBAC Rules | ✅ محفوظة |
| الوصول المباشر للصفحات المخفية | ✅ لا يزال يعمل |

## إعادة التفعيل

لإعادة الواجهة الكاملة، قم بتعديل:

```typescript
// src/config/featureFlags.ts
export const FEATURE_FLAGS = {
  legacyMode: false,  // ← غيّر إلى false
  ...
};
```

ثم أضف روابط القائمة المخفية إلى `NAV_ITEMS` في `src/app/admin/layout.tsx`.
