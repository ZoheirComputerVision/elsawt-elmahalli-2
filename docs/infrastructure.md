# البنية التحتية — الصوت المحلي | The Local Echo

## 1. التطوير المحلي

- **نظام التشغيل**: Windows (تطوير)
- **بيئة التشغيل**: Node.js 18+ (LTS)
- **Framework**: Next.js 16 (App Router)
- **قاعدة البيانات**: PostgreSQL 16 (محلياً عبر Docker)
- **المتطلبات**: `npm install` + `npx prisma generate` + `npx prisma db push`

## 2. التشغيل

```bash
npm run dev        # تطوير (http://localhost:3000)
npm run build       # بناء إنتاجي
npm start           # تشغيل الإنتاج
npm run lint        # فحص الكود
npx prisma studio   # واجهة قاعدة البيانات
```

## 3. النشر

### 3.1 HostingGuru.io
- **استراتيجية النشر**: Git push → auto-deploy
- **المستودع**: GitHub (`ZoheirComputerVision/school-news-ai`)
- **الرابط**: `https://school-news-ai-209c.apps.hostingguru.io/`

### 3.2 Git Workflow
```bash
git add .
git commit -m "وصف التعديل"
git push origin <branch>
```

## 4. المراقبة (Sprint 1.8 — قيد التنفيذ)

| الطبقة | الأداة | الحالة |
|--------|--------|--------|
| تسجيل الأخطاء | `src/lib/logger.ts` (4 مستويات) | ✅ مكتمل |
| Error Boundary | `error.tsx` + `global-error.tsx` | ✅ مكتمل |
| مراقعة الأداء | قيد التخطيط | ⏳ Sprint 1.9 |
| Uptime | UptimeRobot (مقترح) | ⏳ Sprint 1.9 |

## 5. النسخ الاحتياطي

| البيانات | التكرار | الوجهة | الحالة |
|----------|---------|--------|--------|
| PostgreSQL (pg_dump) | يومي | `backups/` | ✅ موثق |
| ملفات الوسائط | أسبوعي | `backups/uploads/` | ✅ موثق |
| استعادة اختبارية | أسبوعي | — | ✅ موثق |

التفاصيل الكاملة: `docs/backup_strategy.md`

## 6. هيكل المجلدات

```
/
├── src/
│   ├── app/               # Next.js App Router (pages + API)
│   │   ├── (admin)/       # مجموعة المسارات المحمية
│   │   ├── admin/         # صفحات الإدارة
│   │   ├── api/           # نقاط API
│   │   └── ...            # صفحات عامة
│   ├── components/        # مكونات React
│   │   ├── features/      # مكونات الميزات
│   │   ├── layout/        # مكونات التخطيط
│   │   ├── news/          # مكونات الأخبار
│   │   └── ui/            # shadcn/ui مكونات
│   ├── features/          # منطق الأعمال (types, schemas, repos, services)
│   └── lib/               # مكتبات (auth, prisma, audit, logger, rbac)
├── prisma/                # Prisma schema + migrations
├── docs/                  # التوثيق
├── reports/               # التقارير
├── memory/                # ذاكرة الجلسات
└── backups/               # النسخ الاحتياطي
```

## 7. البيئة (.env)

| المتغير | الوصف |
|---------|-------|
| `DATABASE_URL` | اتصال PostgreSQL |
| `NEXTAUTH_SECRET` | مفتاح تشفير Auth.js |
| `NEXTAUTH_URL` | رابط التطبيق |
