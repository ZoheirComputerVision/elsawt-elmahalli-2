# قاعدة البيانات — الصوت المحلي | The Local Echo

## 1. نظام قاعدة البيانات

- **النظام**: PostgreSQL (16)
- **الـ ORM**: Prisma (v7) مع `@prisma/adapter-pg`
- **الاتصال**: مباشر عبر TCP (محلي: `localhost:51217`)
- **الحالة**: صحية (HEALTHY)

## 2. النماذج (11 نموذجاً)

### النماذج الأساسية

| النموذج | الحقول الرئيسية | الوصف |
|---------|----------------|-------|
| `Region` | `id`, `name`, `slug`, `type` (wilaya/daira/commune) | التقسيم الجغرافي للتوسع المستقبلي |
| `Category` | `id`, `name`, `slug` | تصنيفات الأخبار |
| `Tag` | `id`, `name`, `slug` | وسوم للأخبار |
| `User` | `id`, `name`, `email`, `role` (ADMIN/EDITOR/REPORTER/READER) | المستخدمون مع RBAC |

### نماذج المحتوى

| النموذج | الحقول الرئيسية | الوصف |
|---------|----------------|-------|
| `News` | `id`, `title`, `slug`, `content`, `summary`, `status`, `regionId`, `categoryId`, `authorId` | الأخبار مع 5 حالات |
| `NewsTag` | `newsId`, `tagId` | علاقة كثير-لكثير |
| `Media` | `id`, `filename`, `url`, `mimeType`, `size`, `uploaderId` | ملفات الوسائط |

### نماذج الأعمال

| النموذج | الحقول الرئيسية | الوصف |
|---------|----------------|-------|
| `DirectoryEntry` | `id`, `name`, `category`, `phone`, `address`, `description`, `regionId` | الدليل الاقتصادي |
| `Ad` | `id`, `title`, `imageUrl`, `linkUrl`, `position`, `status`, `clicks` | الإعلانات |

### نماذج التدقيق

| النموذج | الحقول الرئيسية | الوصف |
|---------|----------------|-------|
| `AuditLog` | `id`, `action`, `entityType`, `entityId`, `userId`, `metadata` | سجل التدقيق الكامل |

## 3. النموذج الجغرافي المستقبلي

```
Wilaya (ولاية)
  ├── id, name, slug, code (رقم الولاية)
  ├── Daira (دائرة)
  │     ├── id, name, slug
  │     ├── Commune (بلدية)
  │     │     ├── id, name, slug
  │     │     ├── News
  │     │     ├── Directory
  │     │     └── Ads
  │     │     Correspondent → User(REPORTER)
```

النظام جاهز لإضافة جداول Wilaya/Daira/Commune في Sprint 1.9 دون تغيير جذري في المعمارية.

## 4. الترحيلات (Migrations)

| الترحيل | التاريخ | الوصف |
|---------|---------|-------|
| `20260621115926_init` | 2026-06-21 | النماذج الأساسية (Region, Category, Tag, News, NewsTag, Media, User, AuditLog) |
| `20260621141020_add_auth_models` | 2026-06-21 | إضافة DirectoryEntry + Ad |
