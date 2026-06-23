# تقرير إصلاح Runtime Error — EditorialTopBar (BreakingNews)

## التاريخ
2026-06-23

## الخطأ
```
TypeError: Cannot read properties of undefined (reading 'findMany')
```
**الموقع:** `src/components/layout/EditorialTopBar.tsx` — سطر 18  
**السبب:** `prisma.breakingNews` غير معرّف (`undefined`) وقت التشغيل.

## التحليل

### 1. فحص schema.prisma
- النموذج `BreakingNews` موجود في `prisma/schema.prisma` (سطور 363–381).
- اسم الجدول: `@@map("breaking_news")` → اسم خاصية Prisma: `breakingNews`.
- الترحيل (`add_breaking_news`) مطبّق والـ database schema up-to-date.

### 2. فحص Prisma Client المُنشأ
- `src/generated/prisma/internal/class.ts` يحتوي على `get breakingNews()` و`breakingNews.findMany` في التعليقات.
- `src/generated/prisma/internal/prismaNamespace.ts` يضم `breakingNews` في قائمة `modelProps`.
- ✅ الـ Client يدعم `prisma.breakingNews` بشكل صحيح بعد `prisma generate`.

### 3. سبب المشكلة
- الـ Prisma Client كان قد أنشئ قبل إضافة نموذج `BreakingNews`، ولم يُعاد توليده بعد الترحيل.
- عند تشغيل `next build`، استُخدمت نسخة قديمة من الـ Client لا تحتوي على الخاصية `breakingNews`.
- الصفحة الرئيسية كانت تسقط بالكامل لعدم وجود `try/catch` حول الاستعلام.

## الإجراءات المتخذة

### أ. تحديث Prisma Client
```bash
npx prisma generate
```
أُعيد توليد الـ Prisma Client بالكامل (إصدار 7.8.0). الآن `prisma.breakingNews` معرّف.

### ب. إضافة معالجة دفاعية (Defensive Error Handling)
**الملف:** `src/components/layout/EditorialTopBar.tsx`

```typescript
// قبل: كان الاستعلام مباشراً دون try/catch
const liveAlerts = await prisma.breakingNews.findMany({ ... });

// بعد: الاستعلام داخل try/catch مع fallback إلى []
let alerts: { title: string; link?: string }[] = [];
try {
  const liveAlerts = await prisma.breakingNews.findMany({ ... });
  alerts = liveAlerts.map((a) => ({ title: a.title, link: a.link ?? undefined }));
} catch {
  alerts = [];
}
```

هذا يضمن:
- ✅ لا سقوط للصفحة الرئيسية حتى لو فشل الاستعلام.
- ✅ إظهار النص البديل "لا توجد أخبار عاجلة حالياً" بدلاً من الخطأ.
- ✅ عدم ظهور Error Boundary.

### ج. التحقق النهائي
- **`npm run lint`:** 0 errors, 4 warnings (مسبقة).
- **`npm run build`:** ✅ بنجاح — جميع المسارات编译 بدون أخطاء.
- **`GET /`:**不会再 يسقط مع 500 — يعود 200 مع أو بدون أخبار عاجلة.

## الملخص
| البند | الحالة |
|---|---|
| نموذج `BreakingNews` في schema | ✅ موجود |
| ترحيل قاعدة البيانات | ✅ مطبّق |
| Prisma Client محدّث | ✅ `prisma generate` ناجح |
| معالجة دفاعية | ✅ `try/catch` في EditorialTopBar |
| Lint | ✅ 0 errors |
| Build | ✅ ناجح |
| Commit | ✅ `5361da8` على `main` |
| Push | ✅ مرفوع |

## توصيات مستقبلية
- إضافة `try/catch` لكل استعلام Prisma في الـ Server Components التي قد تفشل دون تأثير على الصفحة ككل.
- تشغيل `npx prisma generate` في CI/CD بعد كل تغيير في الـ schema.
- التفكير في إنشاء Error Boundary اختياري للـ Server Components.
