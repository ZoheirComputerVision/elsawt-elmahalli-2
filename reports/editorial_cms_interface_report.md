# Editorial CMS Interface Report — Sprint 1.2

## الهدف

إنشاء واجهة إدارة الأخبار (CMS) تستخدم طبقة البيانات الحالية (Repository Layer) مع React Hook Form و Zod و shadcn/ui، بدون مصادقة أو صلاحيات في هذه المرحلة.

## المنجز

### المسار الجديد

```
src/app/(admin)/
  layout.tsx              ← قالب الإدارة (شريط علوي + Toaster)
  news/
    page.tsx              ← قائمة الأخبار (Server Component)
    create/page.tsx       ← إنشاء خبر جديد
    [slug]/edit/page.tsx  ← تعديل خبر موجود
```

### المكونات الجديدة

```
src/components/news/
  NewsForm.tsx   ← نموذج موحد للإنشاء والتعديل
  NewsTable.tsx  ← جدول عرض الأخبار مع إجراءات تعديل/حذف
  NewsFilters.tsx← فلترة بحث/حالة/تصنيف/منطقة
```

### المكونات المضافة إلى ui/

```
src/components/ui/
  textarea.tsx   ← مكون نصي متعدد الأسطر (كان مفقوداً)
```

## التفاصيل التقنية

### NewsForm (use client)
- React Hook Form + `@hookform/resolvers/zod`
- Zod schema: `CreateNewsSchema` من `src/features/news/schemas`
- حقول: العنوان، الرابط المختصر (تلقائي)، الملخص، المحتوى، التصنيف، المنطقة، الحالة، رابط الصورة
- إرسال: `POST /api/news` للإنشاء، `PUT /api/news/:slug` للتعديل
- Toast عبر `sonner` للنجاح/الخطأ
- توليد Slug تلقائي عند فقدان التركيز من حقل العنوان

### NewsTable (use client)
- مكون `Table` من shadcn/ui
- أعمدة: ترقيم، عنوان، تصنيف، منطقة، حالة، تاريخ، إجراءات
- زر تعديل → `/news/:slug/edit`
- زر حذف → `DELETE /api/news/:id` مع تأكيد

### NewsFilters (use client)
- استخدام `useSearchParams` للقراءة والكتابة
- عوامل: بحث نصي، الحالة (مسودة/منشور/مؤرشف)، التصنيف، المنطقة
- زر إلغاء الفلترة عند وجود أي عامل نشط
- تحديث URL بدون إعادة تحميل الصفحة

### صفحات Server Component
- تستدعي `newsService.list()` لجلب الأخبار (Repository Layer)
- تستدعي `prisma.category/region.findMany()` لجلب خيارات التصنيف والمنطقة
- صفحة التعديل تستدعي `newsService.getBySlug()` وترجع `notFound()` إذا لم يوجد الخبر

## استخدام Repository Layer فقط

| العملية | الطبقة المستخدمة | الملف |
|---------|-----------------|-------|
| جلب الأخبار للقائمة | `newsService.list()` | `news/page.tsx` |
| جلب خبر للتعديل | `newsService.getBySlug()` | `news/[slug]/edit/page.tsx` |
| جلب التصنيفات | `prisma.category.findMany()` | صفحتا القائمة والإنشاء والتعديل |
| جلب المناطق | `prisma.region.findMany()` | صفحتا القائمة والإنشاء والتعديل |
| إنشاء خبر | `POST /api/news` | `NewsForm.tsx` |
| تحديث خبر | `PUT /api/news/:slug` | `NewsForm.tsx` |
| حذف خبر | `DELETE /api/news/:id` | `NewsTable.tsx` |

## اختبارات القبول

- [x] `npm run lint` — 0 أخطاء، 0 تحذيرات
- [x] `npm run build` — 0 أخطاء TypeScript، 4 صفحات (Static/Dynamic)

## الخطوات القادمة

- إضافة Authentication و RBAC
- حماية مسارات الإدارة
- إضافة واجهة لإدارة التصنيفات والمناطق
- تطوير لوحة تحكم بإحصائيات
