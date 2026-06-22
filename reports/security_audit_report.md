# تقرير تدقيق الأمن — الصوت المحلي

> التاريخ: 2026-06-22 | الإصدار: 1.0.0-beta

---

## 1. API Routes

### المصادقة والتفويض

| المسار | الطريقة | الحماية | النتيجة |
|--------|---------|---------|---------|
| `/api/auth/[...nextauth]` | GET/POST | Auth.js handler | ✅ |
| `/api/auth/logout` | GET | `signOut()` redirect | ✅ |
| `/api/news` | GET | عام (public) | ⚠️ عام — مطلوب للصفحة العامة |
| `/api/news` | POST | `requireRole("REPORTER")` | ✅ |
| `/api/news/[slug]` | GET | عام (public) | ✅ |
| `/api/news/[slug]` | PUT | `requireRole` مع انتقالات الحالة | ✅ |
| `/api/news/[slug]` | DELETE | `requireRole("ADMIN")` | ✅ |
| `/api/news/search` | GET | عام (public) | ✅ |
| `/api/media` | GET | عام (public) | ⚠️ عام — يعرض جميع الوسائط |
| `/api/media` | POST | `requireRole("EDITOR")` | ✅ |
| `/api/media/[id]` | DELETE | `requireRole("ADMIN")` | ✅ |
| `/api/directory` | GET | عام (public) | ✅ |
| `/api/directory` | POST | `requireRole("EDITOR")` | ✅ |
| `/api/directory/[id]` | GET | عام (public) | ✅ |
| `/api/directory/[id]` | PUT | `requireRole("EDITOR")` | ✅ |
| `/api/directory/[id]` | DELETE | `requireRole("ADMIN")` | ✅ |
| `/api/ads` | GET | عام (public) | ✅ |
| `/api/ads` | POST | `requireRole("EDITOR")` | ✅ |
| `/api/ads/[id]` | GET | عام (public) | ✅ |
| `/api/ads/[id]` | PUT | `requireRole("EDITOR")` | ✅ |
| `/api/ads/[id]` | DELETE | `requireRole("ADMIN")` | ✅ |

**الخلاصة**: جميع المسارات محمية بشكل صحيح. المسارات العامة مصرح بها لغرض العرض العام.

---

## 2. RBAC (صلاحيات الدور)

| الدور | المستوى | الصلاحيات |
|-------|---------|-----------|
| REPORTER | 1 | إنشاء وتعديل المسودات، إرسال للمراجعة |
| EDITOR | 2 | مراجعة، موافقة، إدارة الوسائط/الدليل/الإعلانات |
| ADMIN | 3 | نشر، أرشفة، حذف، إدارة المستخدمين، سجل التدقيق |

**الخلاصة**: الهرم الوظيفي صحيح. دور `ADMIN` يملك جميع صلاحيات `EDITOR` و `REPORTER`.

---

## 3. Auth.js (NextAuth)

| المكون | الحالة |
|--------|--------|
| استراتيجية الجلسة | JWT |
| مزود الدخول | Credentials (بريد + كلمة مرور) |
| تشفير كلمة المرور | bcryptjs |
| مدة الجلسة | 7 أيام |
| صفحة الدخول | `/login` |
| callbackUrl | `/admin` |

**ملاحظات:**
- ✅ كلمات المرور مشفرة بـ bcrypt
- ✅ تسجيل كل عملية دخول في Audit Log
- ✅ التحقق من حالة `active` للمستخدم
- ✅ استخدام JWT مع role + id في التوكن

---

## 4. رفع الملفات (Uploads)

| البند | الحالة |
|-------|--------|
| التحقق من النوع | ✅ الصور فقط: jpg, jpeg, png, gif, webp, svg |
| الحد الأقصى للحجم | ✅ 5 ميجابايت |
| تسمية الملف | ✅ `Date.now()-random.ext` (يمنع التكرار) |
| المسار | `public/uploads/` |
| إزالة الملفات عند الحذف | ✅ `unlink()` مع تجاهل الأخطاء |

**نقاط الضعف المحتملة:**
- ⚠️ الملفات مخزنة في `public/uploads/` — يمكن الوصول إليها مباشرة
- ⚠️ لا يوجد فحص MIME type حقيقي (يعتمد على الامتداد فقط)
- ⚠️ لا يوجد حد أقصى لعدد الملفات لكل مستخدم
- ⚠️ لا يوجد Supabase Storage (المقرر في `decisions.md`)

**التوصية**: الانتقال إلى Supabase Storage في أقرب فرصة.

---

## 5. البحث (Search)

| البند | الحالة |
|-------|--------|
| RBAC | ✅ عام (public) |
| SQL Injection | ✅ Prisma ORM يمنع injection |
| Rate Limiting | ❌ غير مطبق |
| Pagination | ✅ مع حد أقصى 50 نتيجة |

---

## 6. حماية المسارات (Route Protection)

| المسار | الحماية |
|--------|---------|
| `/admin/*` | ✅ `admin/layout.tsx` — `auth()` + redirect |
| `/(admin)/*` | ✅ `(admin)/layout.tsx` — `auth()` + redirect |
| `/login` | ✅ عام |
| `/search` | ✅ عام |
| `/news/*` | ✅ عام (صفحات عامة) |
| `/*` | ✅ عام |

**الخلاصة**: جميع مسارات لوحة التحكم محمية.

---

## 7. الثغرات المحتملة

### أولوية عالية
1. **نقل الملفات إلى Supabase Storage** — الملفات حالياً في `public/` ويمكن الوصول إليها بدون مصادقة
2. **إضافة Rate Limiting** — لا يوجد حد لعدد الطلبات (خاصة POST و DELETE)
3. **CORS** — غير مخصص (لكن Next.js في Vercel يتعامل مع هذا)

### أولوية متوسطة
4. **Audit Log للقراءات الحساسة** — قراءة الوسائط غير مسجلة
5. **تحديث JWT secret** — التأكد من استخدام متغير بيئة قوي
6. **اختبار اختراق** — لم يتم بعد

### أولوية منخفضة
7. **HTTPS** — يتم توفيره تلقائياً عبر Vercel
8. **Headers الأمنية** — Vercel يضيف headers أساسية

---

## 8. التوصيات

### قبل الإطلاق
1. نقل الوسائط إلى Supabase Storage
2. إضافة Rate Limiting على API Routes
3. تدقيق JWT Secret (AUTH_SECRET)
4. اختبار صلاحيات المستخدمين يدوياً

### بعد الإطلاق
5. إجراء اختبار اختراق كامل
6. إضافة CSP headers
7. مراقبة السجلات بانتظام
