# قاعدة البيانات — الصوت المحلي

## 1. نوع قاعدة البيانات
- **الابتدائي**: JsonDB (ملفات JSON)
- **الاحتياطي**: SQLite (معد وليس أساسياً)

## 2. الجداول

| الجدول | الملف | الوصف |
|--------|-------|-------|
| `sources` | `data/sources.json` | مصادر الأخبار (Facebook, RSS, Web) |
| `raw_data` | `data/raw_data.json` | المواد الخام قبل المعالجة |
| `processed_content` | `data/processed_content.json` | المحتوى بعد المعالجة والنشر |
| `media` | `data/media.json` | ملفات الوسائط (صور، فيديو) |
| `archive` | `data/archive.json` | الأرشيف مع بيانات النسخ الاحتياطي |
| `ai_decision_log` | `data/ai_decision_log.json` | سجل قرارات AI |
| `admin_actions` | `data/admin_actions.json` | سجل إجراءات المشرفين (تدقيق) |
| `settings` | `data/settings.json` | إعدادات النظام (key-value) |
| `views` | `data/views.json` | سجل المشاهدات |
| `featured_stories` | `data/featured_stories.json` | الأخبار المميزة في الواجهة |
| `breaking_news` | `data/breaking_news.json` | الأخبار العاجلة |
| `subscribers` | `data/subscribers.json` | المشتركون في النشرات |
| `contacts` | `data/contacts.json` | رسائل التواصل |
| `categories` | `data/categories.json` | التصنيفات المحلية |

## 3. هيكل السجلات

### processed_content
```json
{
  "id": 1,
  "title": "عنوان الخبر",
  "body": "محتوى الخبر",
  "summary": "ملخص",
  "category": "news",
  "region": "tiaret",
  "status": "published",
  "overall_score": 0.85,
  "source_name": "المصدر",
  "published_at": "2026-06-20T...",
  "view_count": 120,
  "image_url": "/uploads/img_xxx.jpg",
  "tenant_id": 1
}
```

### media
```json
{
  "id": 1,
  "filename": "abc123.jpg",
  "original_name": "photo.jpg",
  "mime_type": "image/jpeg",
  "size": 204800,
  "url": "/uploads/abc123.jpg",
  "content_id": 5,
  "usage_count": 2,
  "created_at": "2026-06-20T..."
}
```

### featured_stories
```json
{
  "id": 1,
  "content_id": 5,
  "position": "featured",
  "sort_order": 0,
  "is_active": true,
  "created_by": "admin",
  "created_at": "2026-06-20T..."
}
```

## 4. التحميل المسبق (Seed)
- 3 مصادر افتراضية (Facebook، وزارة التربية، إدخال يدوي)
- 5 إعدادات افتراضية
- 10 تصنيفات محلية
