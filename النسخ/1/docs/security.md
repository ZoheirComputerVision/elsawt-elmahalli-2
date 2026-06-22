# الأمن — الصوت المحلي

## 1. المصادقة (Authentication)
- **JWT tokens** مع expiry 24 ساعة
- **bcrypt** لتشفير كلمات المرور
- Admin: `ADMIN_USERNAME` + `ADMIN_PASSWORD` في `.env`
- المستخدمون الثانويون: جدول `tenant_users` مع صلاحيات أدوار

## 2. التفويض (Authorization)
- التسلسل الهرمي للأدوار: `author(1) < editor(2) < admin(3)`
- `requireRole(role)` — يتحقق من أن دور المستخدم >= المستوى المطلوب
- `requireTenantAccess()` — يتحقق من صلاحية الوصول للمنصة

## 3. CSRF
- مطلوب لجميع الطرق الخطرة (POST/PUT/PATCH/DELETE)
- الرأس: `X-CSRF-Token` = أول 20 حرفاً من JWT token

## 4. تحديد المعدل (Rate Limiting)
| المسار | الحد | النافذة |
|--------|------|---------|
| `/api/*` | 200 طلب | 15 دقيقة |
| `/api/admin/*` | 100 طلب | 15 دقيقة |
| `/api/admin/auth` | 10 محاولات | 15 دقيقة |

## 5. أمان HTTP
- **Helmet**: إعدادات أمان افتراضية
- **CORS**: مفعل لجميع الأصول
- **Content-Type**: JSON فقط
- **الرفع**: حد 5MB، أنواع MIME محدودة (JPEG/PNG/WebP)

## 6. سجل التدقيق (Audit)
- جميع الإجراءات الإدارية تُسجل في `admin_actions`
- جميع قرارات AI تُسجل في `ai_decision_log`
- جميع المشاهدات تُسجل في `views`

## 7. المتغيرات البيئية
| المتغير | الوصف |
|---------|-------|
| `PORT` | منفذ الخادم |
| `DB_TYPE` | `json` أو `sqlite` |
| `JWT_SECRET` | مفتاح JWT السري |
| `ADMIN_USERNAME` | اسم مستخدم المشرف |
| `ADMIN_PASSWORD` | كلمة مرور المشرف (bcrypt) |
| `FACEBOOK_ACCESS_TOKEN` | توكن Facebook API |

## 8. الممارسات المحظورة
- ❌ تخزين كلمات المرور كنص صريح
- ❌ إظهار أخطاء debug في الإنتاج
- ❌ رفع ملفات قابلة للتنفيذ
- ❌ مشاركة JWT_SECRET في الكود
