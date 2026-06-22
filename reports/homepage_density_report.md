# Homepage Editorial Density Report — Sprint 1.2

## Goal
زيادة الكثافة التحريرية للصفحة الرئيسية وجعلها أقرب إلى الصحف الإلكترونية الاحترافية.

## Changes Made

### 1. Increased Max-Width
| Before | After |
|--------|-------|
| `max-w-7xl` (1280px) | `max-w-[90rem]` (1440px) |

عرض المحتوى ازداد بنسبة ~12.5%، مما يتيح عرض أخبار أكثر في كل صف.

### 2. Reduced Vertical Spacing (~30%)

| Element | Before | After | Reduction |
|---------|--------|-------|-----------|
| Section margins | `mb-8` / `my-8` (32px) | `mb-5` / `my-5` (20px) | 37% |
| Hero padding | `py-6` (24px) | `py-4` (16px) | 33% |
| Banner top padding | `pt-6` (24px) | `pt-4` (16px) | 33% |
| Local section gap | `space-y-6` (24px) | `space-y-4` (16px) | 33% |
| Local section padding | `px-4 py-2.5` | `px-3 py-2` | ~20% |
| Section divider | `newspaper-separator` (80px) | `h-px ... my-5` (20px) | 75% |

### 3. SectionHeader Component (New)
**File:** `src/components/features/SectionHeader.tsx`

نمط موحد لجميع عناوين الأقسام:
```
┌──────────────────────────────────────────┐
│ اسم القسم                    المزيد ←    │
│ ════════════════════════════════════════ │  ← 2px gold border
└──────────────────────────────────────────┘
```

- خط ذهبي سفلي (`border-b-2 border-gold`)
- رابط "المزيد" في الجهة اليسرى (RTL)
- يستخدم في: محليات، الوطن، اقتصاد، رأي، متخصصة

### 4. Editorial Separator
```tsx
function EditorialSeparator() {
  return <div className="h-px bg-gradient-to-r from-gold/40 via-gold to-gold/40 my-5" />;
}
```
فاصل تحريري ذهبي متدرج بين الأقسام، بدلاً من `newspaper-separator` السابق.

### 5. Redesigned Sections — 1 Main + 4 Side Pattern

جميع الأقسام التالية أُعيد تصميمها بنمط موحد:

| القسم | الرئيسي | الجانبية | صورة |
|-------|---------|----------|------|
| **محليات** | خبر رئيسي (3/5) | 4 أخبار (2/5) | ✅ صورة للرئيسي |
| **الوطن** | خبر رئيسي (3/5) | 4 أخبار (2/5) | ✅ صورة للرئيسي |
| **اقتصاد** | خبر رئيسي (3/5) | 4 أخبار (2/5) | ✅ أيقونة + صورة |
| **رأي وتحليل** | افتتاحية (3/5) | 4 مقالات (2/5) | ❌ (نصي) |
| **متخصصة** | خبر رئيسي (3/5) | 4 أخبار (2/5) | ✅ صورة للرئيسي |

**توزيع الأعمدة في كل قسم:**
```
Desktop (lg):
┌─────────────────────┬──────────────┐
│                     │ ● خبر جانبي  │
│   الخبر الرئيسي     │ ● خبر جانبي  │
│   (بصورة)           │ ● خبر جانبي  │
│                     │ ● خبر جانبي  │
│ 3/5 width           │ 2/5 width    │
└─────────────────────┴──────────────┘
```

### 6. Removed Duplicate Card Patterns
- **EconomySection**: أُزيلت بطاقات القطاعات الأربعة (استثمار/فلاحة/صناعة/تشغيل) والدليل الاقتصادي
- **SpecializedSection**: أُزيلت بطاقات التخصصات الخمسة (رياضة/ثقافة/تعليم/صحة/تكنولوجيا)
- **OpinionSection**: أُزيلت بطاقات الكتّاب الوهمية والتحليل الجانبي
- **NationalSection**: أُزيلت بطاقة الصورة المكررة لكل خبر

### 7. Adjusted Query Limits

| الاستعلام | قبل | بعد | السبب |
|-----------|-----|-----|-------|
| `getNewsByCategory("nation")` | 4 | 5 | نحتاج 1 رئيسي + 4 جانبي |
| `getNewsByCategory("economy")` | 8 | 5 | نحتاج 5 فقط، لا داعي لـ 8 |
| `getNewsByCategory("opinion")` | 3 | 5 | نحتاج 1 رئيسي + 4 جانبي |

## Files Changed

| الملف | التغيير |
|-------|---------|
| `src/components/features/SectionHeader.tsx` | **جديد** — مكون عنوان القسم الموحد |
| `src/components/features/LocalSection.tsx` | إعادة كتابة — نمط 1+4 مع تبويب المناطق |
| `src/components/features/NationalSection.tsx` | إعادة كتابة — نمط 1+4 |
| `src/components/features/EconomySection.tsx` | إعادة كتابة — نمط 1+4 (إزالة القطاعات والدليل) |
| `src/components/features/OpinionSection.tsx` | إعادة كتابة — نمط 1+4 (إزالة الكتّاب والتحليل) |
| `src/components/features/SpecializedSection.tsx` | إعادة كتابة — نمط 1+4 (إزالة بطاقات التخصصات) |
| `src/app/page.tsx` | تحديث — max-width أكبر، مسافات أقل، فواصل تحريرية، تعديل حدود الاستعلامات |

## Acceptance Tests

| المعيار | النتيجة |
|---------|---------|
| `npm run build` | ✅ Compiled successfully (13.7s + 14s TS) |
| `GET /` | ✅ 200 OK |
| أخبار أكثر داخل الشاشة الواحدة | ✅ مسافات رأسية أقل بنسبة ~30% وعرض أكبر بنسبة ~12.5% |
| وضوح القراءة | ✅ خطوط واضحة، مسافات كافية بين العناصر |
| RTL | ✅ |
| Responsive | ✅ 2→3→6 columns grid |
| ألوان محفوظة (أزرق/ذهبي) | ✅ |
