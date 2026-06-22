# Database Runtime Verification Report — Sprint 1.1B

## Decision: المشروع يعتمد على Prisma Postgres Dev Server (اختيار A)

---

## الأدلة من الملفات

### 1. prisma/schema.prisma

```prisma
datasource db {
  provider = "postgresql"
}
```

- لا يوجد `url` في الـ datasource
- Prisma يفترض أن `DATABASE_URL` تُقرأ من البيئة
- الـ provider هو `postgresql` (هذا لا يحدد إن كان Postgres مباشر أو Prisma Postgres)

### 2. .env

```
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."
```

- **الدليل القاطع**: الـ scheme `prisma+postgres://` هو بروتوكول Prisma Postgres الحصري
- Standard PostgreSQL يكون: `postgresql://user:pass@host:5432/db`
- التعليق يقول صراحة: *"The following `prisma+postgres` URL is similar to the URL produced by running a local Prisma Postgres server with the `prisma dev` CLI command"*
- الـ `api_key` يحتوي بداخله connection string حقيقي لـ PostgreSQL مشفر

### 3. src/lib/prisma.ts

```ts
new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL ?? "",
})
```

- خيار `accelerateUrl` خاص بـ Prisma Accelerate / Prisma Postgres فقط
- لو كان PostgreSQL مباشر، كان المفروض يستخدم خيار `adapter` مع `PrismaPg`
- الـ `@prisma/adapter-pg` موجود في `package.json` (سطر 14) لكنه **غير مستخدم** — دليل إضافي أن المشروع لم يهاجر بعد إلى الاتصال المباشر

### 4. package.json

```json
"@prisma/adapter-pg": "^7.8.0",
"@prisma/client": "^7.8.0",
"prisma": "^7.8.0"
```

- `@prisma/adapter-pg` مُثبَّت لكن لا يوجد أي `import` له في الكود
- لا يوجد سكريبت `"prisma:dev"` أو `"prisma:generate"` في `scripts`
- هذا يؤكد أن المشروع في مرحلة انتقالية أو أن `adapter-pg` فضلة من تجارب سابقة

---

## الخلاصة

| المعيار | Prisma Postgres | PostgreSQL مباشر |
|---------|----------------|------------------|
| URL scheme | `prisma+postgres://` ✅ | `postgresql://` |
| Client option | `accelerateUrl` ✅ | `adapter` |
| Adapter مطلوب | لا | `@prisma/adapter-pg` |
| تشغيل مطلوب | `prisma dev` | PostgreSQL service |
| الحالي | **مطابق** | غير مطابق |

---

## خطوات التشغيل الصحيحة (للمطور)

```
# 1. تشغيل Prisma Postgres Dev Server
npx prisma dev

# 2. إنشاء الـ client (إذا لم يكن موجوداً)
npx prisma generate

# 3. بذر البيانات (لأول مرة)
npx prisma db seed

# 4. تشغيل التطبيق
npm run dev
```

> **هام**: `npx prisma dev` يبقي الـ proxy شغالاً في الـ terminal.
> يجب فتح terminal منفصل له أو تشغيله في الخلفية.

---

## توصية واحدة

استمر باستخدام **Prisma Postgres Dev Server** — هو الإعداد الحالي والمتوافق مع كل الملفات. الـ `@prisma/adapter-pg` المثبت حالياً غير مستخدم ويمكن إزالته (لا يؤثر على التشغيل).
