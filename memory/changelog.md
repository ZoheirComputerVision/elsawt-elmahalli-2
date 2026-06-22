# سجل التغييرات — الصوت المحلي

## v1.1.0 — Sprint 1.8: Geographic Layer Foundation (2026-06-22)

### 🗺️ طبقة البيانات الجغرافية
- **Wilaya/Daira/Commune**: 3 نماذج Prisma جديدة مع العلاقات الكاملة
- **الترحيل**: `add_geographic_models` migration مطبقة (14 نموذج إجمالي)
- **البذْر**: ولاية تيارت (الرمز 14) — 14 دائرة و 34 بلدية
- **المستودع**: `src/features/geographic/` — استعلامات getWilayas/getDairasByWilaya/getCommunesByDaira
- **API Routes**: 16 نقطة نهاية (CRUD + إحصائيات) مع RBAC (ADMIN للكتابة)
- **صفحات الإدارة**: `/admin/wilayas`, `/admin/dairas`, `/admin/communes` — CRUD كامل
- **Dashboard**: 3 بطاقات إحصائية جديدة (الولايات، الدوائر، البلديات)
- **التقارير**: `reports/geographic_layer_report.md`
- **البناء**: 36 route, TypeScript clean (44s)

## v1.0.0-beta — Sprint 1.7 + 1.8: الإصدار الأول (2026-06-22)

### 🏛️ إعادة الهيكلة الاستراتيجية
- **الهوية الرسمية**: الصوت المحلي | The Local Echo — شعار: "اهتمام محلي ... التزام وطني"
- **الرؤية**: بناء أول منصة إعلامية محلية رقمية في الجزائر
- **خريطة التوسع**: 7 مراحل (التجهيز → الشق الأول → التغطية الكاملة → التوسع التاريخي → التوسع الغربي → الهضاب والجنوب → الامتياز الوطني)
- **النموذج الجغرافي**: Wilaya → Daira → Commune → Correspondent
- **الوثائق المحدثة**: README، project_constitution، architecture، database، api_spec، infrastructure
- **القرارات المضافة**: multi-wilaya geographic model + brand identity في decisions.md

### 🚀 إطلاق v1.0.0-beta
- 🛡️ **Production Security Audit**: مراجعة 11 API route + RBAC + upload safety (`reports/security_audit_report.md`)
- ⚠️ **Error Monitoring Layer**: `logger.ts` (4 levels), `error.tsx` (global boundary), `global-error.tsx`, `not-found.tsx`
- 💾 **Backup & Recovery Strategy**: `docs/backup_strategy.md` (pg_dump, Windows/Linux cron, media backup, 30-day rotation)
- 📖 **Editorial Operations Handbook**: `docs/editorial_operations.md` (5-state pipeline, Reporter→Editor→Admin workflows, crisis protocol)
- 📊 **KPI Dashboard**: 12 مؤشر أداء في لوحة التحكم الإدارية (`/admin`)
- ✅ **Production Readiness Report**: 76% readiness, 6/9 sections passing (`reports/production_readiness_report.md`)
- 🏷️ **Git Release**: tag `v1.0.0-beta` على GitHub
- ✅ **Build**: 27 routes, TypeScript clean (26.5s)

### ما سبق (Sprint 1.0–1.7)
- الهيكل التنظيمي للمشروع ووثائق التأسيس
- تحميل المشروع من الملفات المحفوظة والاسترداد
- سكربتات التحقق من البيئة والـ runtime
- الـ CMS التحريري (واجهة + API + NewsForm/NewsTable)
- الهومبيدج الصحفية (Hero, Headlines, أقسام متخصصة)
- المصادقة والأذونات (Auth.js + RBAC + (admin) route group)
- حماية API Routes + صفحات الأخبار العامة
- المديرية الإقتصادية وإدارة الإعلانات + ورشة المراسل + سجل التدقيق
- تحسينات في الـ SEO (sitemap, RSS, robots.txt)

## v0.1.0 — Sprint 0: Project Bootstrap (2026-06-20)

### 🚀 الإطلاق
- إنشاء الهيكل التنظيمي للمشروع
- إنشاء وثائق التأسيس (6 وثائق في `/docs/`)
- تسجيل القرارات التقنية (9 قرارات في `decisions.md`)
- إنشاء خارطة طريق MVP (7 مراحل في `mvp_roadmap.md`)
- تحديد الـ tech stack النهائي

### 🏗️ البنية
- **Frontend**: Next.js 15 + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Next.js API Routes + Prisma + PostgreSQL
- **Auth**: Auth.js (NextAuth v5)
- **Storage**: Supabase Storage
- **Hosting**: Vercel

### 📦 ما تم إنشاؤه
- `/docs/` — 6 وثائق تأسيسية
- `/memory/` — 4 ملفات متابعة (state, session, changelog, decisions)
- `/reports/` — خارطة طريق MVP
- `/backups/` — مجلد النسخ الاحتياطي
- `/features/` — مجلد مقترحات الميزات
