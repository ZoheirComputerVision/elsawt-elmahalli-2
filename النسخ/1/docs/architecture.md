# التصميم المعماري — الصوت المحلي

## 1. نظرة عامة

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                              │
│          HTML5 + CSS3 + Vanilla JS (SPA-like)                 │
│     public/ → index, article, section, search, media, archive │
├──────────────────────────────────────────────────────────────┤
│                     API LAYER                                 │
│          Express.js Router: /api, /api/admin                  │
│          Content CRUD, Search, Auth, Stats                    │
├──────────────────────────────────────────────────────────────┤
│                     BUSINESS LOGIC LAYER                      │
│          modules/ → services, managers, engines               │
│          Collector, Analyzer, Publisher, Scheduler            │
├──────────────────────────────────────────────────────────────┤
│                     DATA LAYER                                │
│          JsonDB (JSON files) → 15+ tables                     │
│          SQLite (prepared, not primary)                       │
│          File storage → public/uploads/                       │
└──────────────────────────────────────────────────────────────┘
```

## 2. مناطق التغطية الثلاث

| المنطقة | المعرف | المدن الرئيسية |
|---------|--------|-----------------|
| ولاية تيارت | `tiaret` | تيارت، عين كرمس، فرندة، السوقر، مهدية |
| ولاية تيسمسيلت | `tissemsilt` | تيسمسيلت، برج بونعامة، ثنية الأحد |
| دائرة قصر الشلالة | `ksar-chellala` | قصر الشلالة |

## 3. طبقات النظام

### 3.1 طبقة العرض (Client Layer)
- صفحات ثابتة مع JS ديناميكي
- تصميم متجاوب (Mobile-first)
- هوية بصرية: أزرق ملكي + ذهبي

### 3.2 طبقة API
- RESTful endpoints تحت `/api/`
- مصادقة JWT للمسارات الإدارية
- CSRF protection
- Rate limiting

### 3.3 طبقة منطق الأعمال
- **محرك المحتوى**: جمع → تحليل → كتابة → نشر → أرشفة
- **الدليل الاقتصادي**: شركات، مؤسسات، أرقام هواتف
- **الإعلانات**: 6 مناطق إعلانية، حملات، تتبع
- **البحث**: بحث نصي في المحتوى والأرشيف

### 3.4 طبقة البيانات
- JsonDB للقراءة/الكتابة السريعة
- SQLite للاستعلامات المعقدة (جاهز)
- تخزين الملفات للمرفقات والصور

## 4. الأمن
- JWT للمصادقة (24h expiry)
- bcrypt لكلمات المرور
- CSRF tokens للطلبات الخطرة
- Rate limiting لمنع الهجمات
- Helmet للأمان العام

## 5. النشر
- منصة: HostingGuru.io / Render.com
- استراتيجية: Git push → auto-deploy
- مراقبة: UptimeRobot
