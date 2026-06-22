# Prisma Runtime Verification Report

## 1. نوع DATABASE_URL

```
prisma+postgres://localhost:51213/?api_key=...
```

| المكون | القيمة |
|--------|--------|
| **Scheme** | `prisma+postgres://` |
| **Host** | `localhost` |
| **Port** | `51213` |
| **Auth** | `api_key` (base64url مشفر) |

الـ `api_key` فك تشفيره يكشف عن اتصال PostgreSQL الفعلي:

```json
{
  "databaseUrl": "postgres://postgres:postgres@localhost:51217/template1?sslmode=disable...",
  "shadowDatabaseUrl": "postgres://postgres:postgres@localhost:51215/template1?sslmode=disable..."
}
```

**الخلاصة**: `prisma+postgres://` = **Prisma Postgres Dev Server**.

---

## 2. كيف يعمل Prisma Client

```
PrismaClient
  └─ accelerateUrl: "prisma+postgres://localhost:51213/"
       └─ HTTP fetch → localhost:51213
            └─ Prisma Postgres Proxy (npx prisma dev)
                 └─ PostgreSQL → localhost:51217
```

الـ `accelerateUrl` يوجه العميل لعمل طلبات HTTP إلى proxy محلي. الـ proxy هو المسؤول عن الترجمة إلى PostgreSQL الحقيقي.

---

## 3. التحقق من الصيغة

```ts
new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL
})
```

**الصيغة صحيحة من ناحية التشغيل.** خيار `accelerateUrl` في Prisma v7 يقبل:

| الـ URL | المنتج | يعمل مع accelerateUrl؟ |
|---------|--------|------------------------|
| `prisma://` | Prisma Accelerate (cloud) | ✅ |
| `prisma+postgres://` | Prisma Postgres (local dev) | ✅ |
| `postgresql://` | PostgreSQL مباشر | ❌ (يحتاج `adapter`)|

الاسم `accelerateUrl` مضلل — هو ليس حصرياً لـ Accelerate بل هو الخيار الوحيد للاتصال عبر HTTP proxy. Prisma v7 أزالت المحرك المضمن ولا تدعم الاتصال المباشر إلا عبر `adapter`.

---

## 4. سبب ECONNREFUSED

```
fetch failed → AggregateError → ECONNREFUSED (localhost:51213)
```

**سبب واحد فقط: Prisma Dev Server متوقف.**

الأدلة:

1. **الاتصال يذهب إلى `localhost:51213`** — هذا منفذ Prisma Postgres Proxy وليس PostgreSQL مباشر
2. **`ECONNREFUSED` تعني أن لا شيء يستمع على ذلك المنفذ** — الـ proxy مشغَّل بواسطة `npx prisma dev` فقط
3. **الـ api_key سليم** — فك تشفيره أظهر اتصال PostgreSQL صحيح إلى `localhost:51217`
4. **صيغة PrismaClient صحيحة** — `accelerateUrl` يتعامل مع `prisma+postgres://` بشكل سليم

السبب الوحيد: لم يتم تشغيل `npx prisma dev` قبل تشغيل التطبيق.

---

## 5. الإصلاح

تشغيل الـ proxy مسبقاً:

```powershell
# Terminal 1: شغل Prisma Postgres Proxy
npx prisma dev

# Terminal 2: شغل التطبيق
npm run dev
```

`npx prisma dev` يبقي العملية شغالة ويجب أن تبقى مفتوحة طوال جلسة التطوير.

---

## 6. ملخص

| السؤال | الإجابة |
|--------|---------|
| نوع DATABASE_URL؟ | `prisma+postgres://` — Prisma Postgres Dev Server |
| كيف يعمل العميل؟ | عبر `accelerateUrl` بطلبات HTTP إلى proxy محلي |
| هل الصيغة صحيحة؟ | نعم، `accelerateUrl` يقبل `prisma+postgres://` |
| سبب ECONNREFUSED؟ | **Prisma Dev Server متوقف** على `localhost:51213` |
