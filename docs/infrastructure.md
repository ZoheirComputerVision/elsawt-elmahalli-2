# البنية التحتية — الصوت المحلي

## 1. التطوير المحلي
- **نظام التشغيل**: Windows (تطوير) / Linux (إنتاج)
- **بيئة التشغيل**: Node.js v18+
- **الخادم**: Express.js 4.x
- **المتطلبات**: `npm install`

## 2. التشغيل
```bash
# تطوير
npm start
# → http://localhost:3000

# فحص الأخطاء
node --check public/js/*.js

# اختبارات
node tests/*.test.js
```

## 3. النشر

### 3.1 HostingGuru.io
- **استراتيجية النشر**: Git push → auto-deploy
- **المستودع**: GitHub (`ZoheirComputerVision/school-news-ai`)
- **الرابط**: `https://school-news-ai-209c.apps.hostingguru.io/`

### 3.2 Render.com
- **استراتيجية النشر**: Git push → Render auto-deploy
- **المستودع**: GitHub (`ZoheirComputerVision/Elsawt_Elmahalli`)
- **الرابط**: `https://elsawt-elmahalli-1.onrender.com/`
- **ملاحظة**: Render free plan يطفئ السيرفر بعد 15 دقيقة خمول

## 4. المراقبة
- **UptimeRobot**: فحص كل 5-10 دقائق
- **Morgan**: تسجيل الطلبات
- **Console.log**: تسجيل الأخطاء في التطوير

## 5. النسخ الاحتياطي
| البيانات | التكرار | الوجهة |
|----------|---------|--------|
| ملفات JSON | تلقائي قبل التعديل | `/backups/` |
| SQLite | حسب الحاجة | `/backups/` |
| المرفقات | حسب الحاجة | `/backups/uploads/` |

## 6. هيكل المجلدات
```
/
├── admin/            # صفحات الإدارة (HTML)
├── public/           # الملفات العامة
│   ├── css/          # أنماط CSS
│   ├── js/           # نصوص JS
│   └── uploads/      # الملفات المرفوعة
├── modules/          # خدمات منطق الأعمال
├── routes/           # نقاط API
├── middleware/        # الوسائط (auth, validate)
├── lib/              # مكتبات (DAL, repositories)
├── data/             # قواعد بيانات JSON
├── config/           # ملفات الإعدادات
├── docs/             # التوثيق
├── features/         # مقترحات الميزات
├── memory/           # ذاكرة الجلسات
├── backups/          # النسخ الاحتياطي
└── reports/          # التقارير
```

## 7. cron jobs
| المهمة | التكرار | الوصف |
|--------|---------|-------|
| جمع الأخبار | كل 30 دقيقة | جمع من جميع المصادر |
| تحليل المحتوى | كل 15 دقيقة | تصنيف وتقييم |
| نشر تلقائي | كل 10 دقائق | نشر المحتوى المؤهل |
| الأرشفة | كل 6 ساعات | أرشفة المحتوى القديم |
| إعادة تعيين العداد | منتصف الليل | عداد النشر اليومي |
