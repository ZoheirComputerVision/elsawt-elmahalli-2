# تقرير: عدم توافق بروتوكول Accelerate مع Prisma Client v7.8.0

## تاريخ التقرير
2026-06-21

## الخطأ
```
PrismaClientKnownRequestError:
Invalid `prisma.region.upsert()` invocation in prisma/seed.ts:46:35

Using an HTTP connection string is not supported with Prisma Client version 7.8.0 by this version of `prisma dev`. Please either use a direct TCP connection string or upgrade your client to version 7.2.0.
```

## الـ Stack Trace الكامل
```
at zr.handleRequestError (node_modules\@prisma\client\src\runtime\RequestHandler.ts:237:13)
at zr.handleAndLogRequestError (node_modules\@prisma\client\src\runtime\RequestHandler.ts:183:12)
at zr.request (node_modules\@prisma\client\src\runtime\RequestHandler.ts:152:12)
at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
at async a (node_modules\@prisma\client\src\runtime\getPrismaClient.ts:963:24)
at async main (prisma/seed.ts:46:15)
```

**رمز الخطأ:** P6000
**إصدار Prisma Client:** 7.8.0
**نموذج Prisma:** Region

## الخدمة والمنفذ المسببين
- **الخدمة:** Prisma Postgres proxy (`prisma dev`) على المنفذ **51213**
- **السبب:** بروتوكول Accelerate (`prisma+postgres://`) الذي يستخدم `accelerateUrl` في `PrismaClient` لا يتوافق مع إصدار Prisma Client v7.8.0
- `prisma dev` يعمل ويستمع على المنافذ 51213 (proxy)، 51215 (shadow db)، 51217 (postgresql مباشر)

## التحليل الفني
1. `prisma dev` يُنشئ خادم PostgreSQL محلي على المنفذ 51217
2. المنفذ 51213 هو proxy يتحدث بروتوكول Accelerate (HTTP)
3. `DATABASE_URL` في `.env` تستخدم `prisma+postgres://localhost:51213/` وهو رابط HTTP (Accelerate)
4. `src/lib/prisma.ts` يستخدم `accelerateUrl` لتوصيل `PrismaClient` عبر بروتوكول Accelerate
5. الـ proxy (51213) لا يدعم إصدار Prisma Client 7.8.0 - يقبل فقط حتى الإصدار 7.2.0 عبر HTTP
6. الخادم PostgreSQL المباشر على المنفذ 51217 يعمل ويتقبل الاتصالات TCP المباشرة

## خيارات الإصلاح

### الخيار 1 (مُوصى به): استخدام الاتصال المباشر TCP
تغيير `DATABASE_URL` في `.env` إلى رابط PostgreSQL المباشر الذي يوفره `prisma dev`:
```
DATABASE_URL="postgres://postgres:postgres@localhost:51217/template1?sslmode=disable&connection_limit=10&connect_timeout=0&pool_timeout=0&socket_timeout=0&max_idle_connection_lifetime=0"
```
وتغيير `src/lib/prisma.ts` لاستخدام `adapter` من `@prisma/adapter-pg` بدلاً من `accelerateUrl`:
```ts
import { PrismaPg } from '@prisma/adapter-pg'
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
```
هذا الخيار يتطلب تعديل ملفين: `.env` و `src/lib/prisma.ts`.

### الخيار 2: خفض إصدار Prisma Client
تثبيت `@prisma/client@7.2.0` ليتوافق مع بروتوكول Accelerate الخاص بـ `prisma dev`:
```
npm install @prisma/client@7.2.0
npx prisma generate
```
هذا الخيار يحافظ على الإعدادات الحالية ولا يتطلب تعديل أي ملف، لكنه يخفض الإصدار.

### الخيار 3: استخدام Prisma Postgres السحابي (بدون `prisma dev`)
ربط قاعدة بيانات PostgreSQL سحابية حقيقية بدلاً من المحلية، مع رابط `prisma+postgres://` مباشر من Prisma Postgres. هذا يتطلب اشتراك Prisma Postgres.

## التوصية
الخيار 1 هو الأفضل على المدى الطويل لأنه يستخدم البروتوكول المباشر TCP (أسرع وأكثر استقراراً)، ولا يتطلب خفض الإصدار، ويستفيد من قاعدة PostgreSQL المحلية التي يوفرها `prisma dev`.
