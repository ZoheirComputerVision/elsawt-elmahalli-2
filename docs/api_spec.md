# مواصفات API — الصوت المحلي

## 1. القاعدة
- **عام**: `GET /api/*`
- **إداري**: `POST/PUT/DELETE /api/admin/*` (يتطلب JWT)
- **المصادقة**: `Authorization: Bearer <token>`
- **CSRF**: `X-CSRF-Token: <token_prefix>`
- **الترميز**: JSON
- **الترقيم**: `?limit=20&offset=0`

## 2. نقاط النهاية العامة

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET | `/api/status` | حالة المنصة |
| GET | `/api/content` | قائمة المحتوى المنشور |
| GET | `/api/content/:id` | مقال محدد |
| POST | `/api/content/:id/view` | تسجيل مشاهدة |
| GET | `/api/featured` | الأخبار المميزة |
| GET | `/api/breaking-news` | الأخبار العاجلة |
| GET | `/api/search?q=` | بحث في المحتوى |
| GET | `/api/categories` | قائمة التصنيفات |
| GET | `/api/local-categories` | التصنيفات المحلية (10) |
| GET | `/api/nav` | شريط التنقل |
| GET | `/api/latest-news` | آخر الأخبار للتicker |
| GET | `/api/section/:category` | محتوى قسم محدد |
| GET | `/api/timeline` | الخط الزمني للأرشيف |
| GET | `/api/stats` | إحصائيات عامة |

## 3. نقاط النهاية الإدارية

| الطريقة | المسار | الصلاحية | الوصف |
|---------|--------|----------|-------|
| POST | `/api/admin/auth` | — | تسجيل الدخول |
| GET | `/api/admin/dashboard` | admin | لوحة التحكم |
| GET | `/api/admin/content` | editor+ | قائمة المحتوى |
| GET | `/api/admin/content/:id` | editor+ | تفاصيل مقال |
| POST | `/api/admin/content/:id/approve` | editor+ | الموافقة على مقال |
| POST | `/api/admin/content/:id/reject` | editor+ | رفض مقال |
| POST | `/api/admin/content/:id/delete` | admin | حذف مقال |
| POST | `/api/admin/content/:id/update` | editor+ | تعديل مقال |
| POST | `/api/admin/content/:id/image` | editor+ | تعيين صورة المقال |
| POST | `/api/admin/collect` | admin | جمع يدوي |
| POST | `/api/admin/collect/manual` | editor+ | إدخال يدوي |
| POST | `/api/admin/analyze` | admin | تحليل يدوي |
| POST | `/api/admin/publish` | admin | نشر يدوي |
| GET | `/api/admin/logs` | admin | سجل القرارات |
| GET | `/api/admin/settings` | admin | الإعدادات |
| POST | `/api/admin/settings` | admin | تحديث إعداد |
| GET | `/api/admin/featured-stories` | editor+ | قائمة المميزة |
| POST | `/api/admin/featured-stories` | editor+ | إضافة مميزة |
| PUT | `/api/admin/featured-stories/:id` | editor+ | تعديل مميزة |
| DELETE | `/api/admin/featured-stories/:id` | editor+ | حذف مميزة |
| POST | `/api/admin/featured-stories/reorder` | editor+ | إعادة ترتيب |
| GET | `/api/admin/media` | editor+ | قائمة الوسائط |
| POST | `/api/admin/media/upload` | editor+ | رفع وسائط |
| DELETE | `/api/admin/media/:id` | admin | حذف وسيط |

## 4. استجابة الخطأ
```json
{
  "success": false,
  "error": "رسالة الخطأ"
}
```

## 5. أكواد الحالة
| الكود | المعنى |
|-------|--------|
| 200 | نجاح |
| 201 | تم الإنشاء |
| 400 | طلب خاطئ |
| 401 | غير مصرح |
| 403 | ممنوع (CSRF/صلاحية) |
| 404 | غير موجود |
| 429 | تجاوز الحد المسموح |
| 500 | خطأ داخلي |
