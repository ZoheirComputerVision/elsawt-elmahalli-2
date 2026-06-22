# تقرير تدقيق الإطلاق التجريبي — الصوت المحلي

> التاريخ: 2026-06-22 | الإصدار: 1.3.0

---

## 1. Security ✅ (95%)

| البند | الحالة | ملاحظات |
|-------|--------|---------|
| RBAC على جميع API Routes | ✅ | REPORTER/EDITOR/ADMIN |
| حماية المسارات الإدارية | ✅ | auth() مع redirect |
| تشفير كلمات المرور | ✅ | bcryptjs |
| JWT مع role + id | ✅ | توكن آمن (NextAuth.js) |
| Rate Limiting | ✅ | 6 مسارات رئيسية محمية |
| معالج أخطاء موحد | ✅ | AppError + PrismaError |
| التحقق من المتغيرات البيئية | ✅ | src/lib/env.ts |
| Supabase Storage | ❌ | لا يزال محلياً — Sprint 2.0 |

---

## 2. Public News Experience ✅ (90%)

| البند | الحالة |
|-------|--------|
| Breadcrumbs | ✅ مسار التصفح مع روابط للولاية والدائرة |
| Author Box | ✅ اسم وصورة وتخصص المراسل |
| Related Articles | ✅ 4 مقالات ذات صلة حسب التصنيف |
| Reading Time | ✅ وقت القراءة المقدر |
| Share Buttons | ✅ فيسبوك، X، واتساب |
| Copy Link | ✅ زر نسخ الرابط مع إشعار |
| Print Version | ✅ زر طباعة |
| View Counter | ✅ عداد المشاهدات +1 عند الزيارة |
| Newsletter CTA | ✅ نموذج اشتراك ضمن المقال |
| Open Graph | ✅ og:title, og:description, og:type=article |

---

## 3. Journalist Profiles ✅ (85%)

| البند | الحالة |
|-------|--------|
| المسار | `/reporters/[slug]` |
| الاسم | ✅ |
| الصورة | ✅ حرف أول كافاتار |
| السيرة المهنية | ✅ bio |
| التخصص | ✅ specialization |
| المنطقة المغطاة | ✅ commune → daira → wilaya |
| عدد المقالات | ✅ مع قائمة بالمقالات المنشورة |
| ربط المقالات | ✅ createdBy في News |

**ملاحظة**: لا توجد صفحة `/reporters` (قائمة) — ستضاف في التحديث القادم.

---

## 4. Directory Public Pages ✅ (90%)

| البند | الحالة |
|-------|--------|
| المسار | `/directory` و `/directory/[slug]` |
| قائمة الدليل | ✅ معروضة على 3 أعمدة |
| البحث حسب التصنيف | ✅ روابط تصنيف مع العدد |
| صفحة التفاصيل | ✅ جميع معلومات الاتصال |
| الموقع الجغرافي | ✅ commune → daira → wilaya |
| حالة التحقق | ✅ عرض "مميز" للقيود المميزة |
| Breadcrumbs | ✅ الرئيسية → الدليل → الاسم |

---

## 5. Advertising Showcase ✅ (85%)

| البند | الحالة | ملاحظات |
|-------|--------|---------|
| Ad Views Tracking | ✅ نموذج AdView مع عداد views |
| API لتسجيل المشاهدة | ✅ POST /api/ads/view |
| Admin CTR Display | ✅ views, clicks, CTR في لوحة التحكم |
| Public Ad Display | ✅ ضمن الصفحات الجغرافية |
| Geolocation | ✅ ads مرتبطة بـ commune |

**ملاحظة**: لا توجد صفحة `/ads` عامة بعد — الإعلانات معروضة ضمن الصفحات الجغرافية.

---

## 6. Geographic Landing Pages ✅ (90%)

| البند | Wilaya | Daira | Commune |
|-------|--------|-------|---------|
| المسار | `/wilaya/[slug]` | `/daira/[slug]` | `/commune/[slug]` |
| آخر الأخبار | ✅ | ✅ | ✅ |
| الإعلانات | ✅ | — | — |
| الدليل الاقتصادي | ✅ | ✅ | ✅ |
| المراسلون | ✅ | — | ✅ |
| القائمة الفرعية | الدوائر | البلديات | — |
| رابط العودة | الرئيسية | الولاية | الدائرة |

---

## 7. Newsletter Module ✅ (80%)

| البند | الحالة |
|-------|--------|
| Prisma Model | ✅ NewsletterSubscription |
| Subscription Form | ✅ في المقال + API |
| Admin Management | ✅ /admin/newsletter مع جدول وإحصائيات |
| API | ✅ POST /api/newsletter مع rate limiting |
| Email Sending | ❌ غير مطبق — يتطلب تكامل SMTP/Mailchimp |

---

## 8. Contact Center ✅ (85%)

| البند | الحالة |
|-------|--------|
| المسار | `/contact` |
| نموذج تواصل عام | ✅ |
| اقتراح خبر | ✅ |
| تصحيح خبر | ✅ |
| بلاغ محلي | ✅ |
| Prisma Model | ✅ ContactMessage |
| Admin Management | ✅ /admin/contact مع علامات مقروء/جديد |
| API | ✅ POST /api/contact مع rate limiting |

---

## 9. Dashboard Analytics ✅ (100%)

| البند | الحالة |
|-------|--------|
| Articles Published | ✅ |
| Pending Reviews | ✅ |
| Reporter Activity | ✅ + Editors + Admins |
| Regional Coverage | ✅ wilayas/dairas/communes |
| Newsletter Subscribers | ✅ |
| Contact Messages | ✅ + unread count |
| Ads Performance | ✅ views + clicks + CTR |

---

## 10. Summary

| المجال | الجاهزية |
|--------|----------|
| Security | 95% |
| Public News Experience | 90% |
| Journalist Profiles | 85% |
| Directory Public Pages | 90% |
| Advertising Showcase | 85% |
| Geographic Landing Pages | 90% |
| Newsletter Module | 80% |
| Contact Center | 85% |
| Dashboard Analytics | 100% |

**الجاهزية الإجمالية للإطلاق التجريبي**: **89%**

---

## 11. Launch Blockers

### 🚫 يجب حلها قبل الإطلاق
1. Supabase Storage — الملفات لا تزال محلية
2. SMTP/Email — إرسال النشرات البريدية
3. قائمة /reporters — صفحة جماعية للمراسلين

### ✅ جاهز للإطلاق التجريبي
1. Public News Experience مع جميع التحسينات
2. Geographic Landing Pages (wilaya/daira/commune)
3. Directory Public Pages
4. Contact Center
5. Newsletter Subscription
6. Journalist Profiles
7. Analytics Dashboard (23 KPI)
8. Ad Views Tracking
9. Rate Limiting + Error Handling
10. Security (RBAC + Auth + Audit)
