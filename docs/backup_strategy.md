# استراتيجية النسخ الاحتياطي والاستعادة

## 1. نسخ PostgreSQL الاحتياطية

### النسخ اليدوي (أمر واحد)
```bash
pg_dump "postgres://postgres:postgres@localhost:5432/template1" \
  --format=custom \
  --file=backups/db_$(date +%Y-%m-%d_%H%M).dump
```

### النسخ المجدول (cron — Linux/Mac)
```cron
# نسخ يومي عند الساعة 03:00
0 3 * * * pg_dump "postgres://..." --format=custom --file=/backups/db_$(date +\%Y-\%m-\%d).dump

# نسخ أسبوعي كامل (الأحد)
0 3 * * 0 pg_dump "postgres://..." --format=custom --file=/backups/db_weekly_$(date +\%Y-\%W).dump
```

### النسخ المجدول (Windows Task Scheduler — PowerShell)
```powershell
# backup.ps1
$date = Get-Date -Format "yyyy-MM-dd_HHmm"
$url = "postgres://postgres:postgres@localhost:5432/template1"
$file = "C:\backups\elsawt_db_$date.dump"
pg_dump $url --format=custom --file=$file
# حذف النسخ older من 30 يوماً
Get-ChildItem C:\backups\elsawt_db_*.dump | Where-Object { $_.CreationTime -lt (Get-Date).AddDays(-30) } | Remove-Item
```

### الاستعادة من نسخة
```bash
pg_restore --clean --if-exists --dbname "postgres://postgres:postgres@localhost:5432/template1" backups/db_2026-06-22_0300.dump
```

---

## 2. نسخ الوسائط (Media Files)

### النسخ الاحتياطي للصور
```bash
# ضغط مجلد الوسائط
tar -czf backups/media_$(date +%Y-%m-%d).tar.gz -C public/uploads .

# أو robocopy لنظام Windows
robocopy public/uploads backups/media_$(date +%Y-%m-%d) /MIR
```

---

## 3. الاحتفاظ بالنسخ

| النوع | التكرار | الاحتفاظ |
|-------|---------|----------|
| يومي | كل 24 ساعة | 7 أيام |
| أسبوعي | كل أحد | 4 أسابيع |
| شهري | أول كل شهر | 12 شهراً |

---

## 4. إجراء الاستعادة الأسبوعي

### الجمعة 02:00 — اختبار استعادة أسبوعي
1. إنشاء قاعدة اختبار:
```bash
createdb "postgres://postgres:postgres@localhost:5432/elsawt_restore_test"
```
2. استعادة النسخة:
```bash
pg_restore --dbname "postgres://postgres:postgres@localhost:5432/elsawt_restore_test" backups/db_latest.dump
```
3. التحقق من البيانات:
```sql
SELECT COUNT(*) FROM news;
SELECT COUNT(*) FROM users;
```
4. حذف قاعدة الاختبار:
```bash
dropdb "postgres://postgres:postgres@localhost:5432/elsawt_restore_test"
```
5. التحقق من ملفات الوسائط:
```bash
ls public/uploads/ | wc -l
```

---

## 5. قائمة تحقق الطوارئ

### عند انهيار قاعدة البيانات:
1. إيقاف التطبيق
2. استعادة آخر نسخة قاعدة
3. التحقق من تكامل البيانات
4. إعادة تشغيل التطبيق
5. التحقق من صحة الصفحة الرئيسية
6. التحقق من صحة لوحة التحكم
7. تسجيل الحادثة في تقرير

### عند فقدان الملفات:
1. فك ضغط آخر نسخة وسائط
2. التحقق من تكامل الصور
3. إعادة تشغيل التطبيق
4. التحقق من معرض الوسائط

---

## 6. الأدوات المطلوبة

- `pg_dump` + `pg_restore` (PostgreSQL client tools)
- `tar` أو `robocopy` (لضغط الملفات)
- مساحة تخزين كافية (تقدير: 5x حجم قاعدة البيانات)
