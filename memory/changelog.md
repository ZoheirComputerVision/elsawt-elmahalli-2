# سجل التغييرات — الصوت المحلي

## v1.0.0-beta — Sprint 1.7 + 1.8: الإصدار الأول (2026-06-22)

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
