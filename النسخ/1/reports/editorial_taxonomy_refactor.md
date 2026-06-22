# Editorial Taxonomy & Homepage Refactor — Sprint 0.8

## Overview
Restructured the homepage from a general news portal into a **professional digital regional newspaper** with a new editorial taxonomy (7 main sections with submenus) and a reordered, denser layout reflecting the identity of "الصوت المحلي".

---

## 1. Navigation Taxonomy Refactor

### Before (10 flat items)
الرئيسية • تيارت • تيسمسيلت • قصر الشلالة • اقتصاد • رياضة • ثقافة • رأي • مجتمع • علوم

### After (7 hierarchical sections with dropdowns)

| Section | Submenu |
|---|---|
| الرئيسية | — |
| محليات | تيارت • تيسمسيلت • قصر الشلالة • البلديات |
| الوطن | سياسة • مجتمع • تنمية • مؤسسات |
| العالم | عربي • إفريقيا • دولي |
| اقتصاد | استثمار • فلاحة • صناعة • تشغيل • دليل اقتصادي |
| رأي | افتتاحيات • مقالات رأي • تحليلات |
| متخصصة | رياضة • ثقافة • تعليم • صحة • تكنولوجيا • بيئة |

### UI Features
- **Desktop**: Hover-triggered dropdown with gold top border, shadow, clean menu items
- **Mobile**: Accordion-style expand/collapse with chevron rotation, right-border indent for nested items
- Active state: "الرئيسية" highlighted in gold

---

## 2. Homepage Reorder

New reading flow (14 sections):

```
 1. EditorialTopBar       — breaking ticker + date + social
 2. NewspaperMasthead     — logo + search
 3. NewspaperNav          — taxonomy nav with dropdowns
 4. BannerAd              — main advertising banner
 5. HeroSection           — dominant story (3/5 + 2/5 grid)
 6. HeadlinesSection      — أبرز العناوين (numbered list)
 7. LocalSection          — محليات (tabbed by region)
 8. NationalSection       — الوطن (4 cards)
 9. EconomySection        — اقتصاد (sectors + directory)
10. OpinionSection        — رأي وتحليل (editorial + articles + analysis)
11. SpecializedSection    — متخصصة (5 category cards)
12. EconomicDirectory     — business directory preview
13. LatestNewsGrid        — آخر الأخبار (12 articles)
14. Footer                — 4-column footer
```

---

## 3. New Components Created (5)

| Component | File | Description |
|---|---|---|
| **LocalSection** | `src/components/features/LocalSection.tsx` | Tabbed region filter (الكل/تيارت/تيسمسيلت/قصر الشلالة), featured story (2/3) + 4 secondary stories (1/3), navy region header, per-region "المزيد" link |
| **NationalSection** | `src/components/features/NationalSection.tsx` | 4-column grid of national news cards with image placeholder, category badge, title, summary, date |
| **EconomySection** | `src/components/features/EconomySection.tsx` | 4 sector cards (استثمار/فلاحة/صناعة/تشغيل) with icons, article count, colored backgrounds + embedded directory preview (3 business entries) |
| **SpecializedSection** | `src/components/features/SpecializedSection.tsx` | 5-column grid (رياضة/ثقافة/تعليم/صحة/تكنولوجيا) with icon, description, article count, pastel color scheme per category |

## 4. Components Redesigned (3)

| Component | Changes |
|---|---|
| **NewspaperNav** | Complete rewrite: 7 hierarchical items, `DesktopNavItem` (hover dropdown with gold border) + `MobileAccordion` (expand with chevron + indent), active state on الرئيسية |
| **HeroSection** | Expanded to 5-column grid (3/5 main + 2/5 secondary), gold category ribbon, gradient overlay enhanced, compact "+" link for extra story, improved metadata layout |
| **OpinionSection** | 3-column newspaper-style layout: main افتتاحية (2/3, gold-top border, "افتتاحية" badge), 2 مقال رأي cards, sidebar تحليل with navy header, author avatars |

## 5. Components Kept Unchanged

| Component | Reason |
|---|---|
| EditorialTopBar | Already matches newspaper style |
| NewspaperMasthead | Already matches newspaper style |
| BannerAd | Generic, works as is |
| HeadlinesSection | Numbered list works well |
| EconomicDirectoryPreview | Matches business directory identity |
| LatestNewsGrid | Dense 12-article grid |
| Footer | 4 columns, complete |

---

## 6. Page Layout (`page.tsx`)

All sections wrapped in `<section>` or contained in `max-w-7xl` wrapper. White background sections for hero (bg-white with border-y) to create visual separation. `newspaper-separator` gradient dividers between all major sections.

---

## 7. Tests

| Test | Result |
|---|---|
| `npx next build` | ✅ 0 errors (10.2s compile, 17.7s TS, 739ms generate) |
| `npm run lint` | ✅ 0 errors, 2 warnings (old file only) |

---

## 8. Complete File Change List

### New Files
- `src/components/features/LocalSection.tsx`
- `src/components/features/NationalSection.tsx`
- `src/components/features/EconomySection.tsx`
- `src/components/features/SpecializedSection.tsx`

### Modified Files
- `src/components/layout/NewspaperNav.tsx` — complete rewrite with dropdown taxonomy
- `src/components/features/HeroSection.tsx` — enhanced grid + ribbon + metadata
- `src/components/features/OpinionSection.tsx` — newspaper column redesign
- `src/app/page.tsx` — new 14-section layout
- `src/components/layout/EditorialTopBar.tsx` — no changes
- `src/components/layout/NewspaperMasthead.tsx` — no changes
- `src/components/features/EconomicDirectoryPreview.tsx` — no changes
- `src/components/features/LatestNewsGrid.tsx` — no changes
- `src/app/globals.css` — no changes needed

### Report
- `reports/editorial_taxonomy_refactor.md`

---

## 9. Visual Identity Preserved

- **RTL**: `dir="rtl"` + `lang="ar"` in layout
- **Font**: Cairo via `next/font/google` (arabic subset)
- **Colors**: Navy `#1a2744` • Gold `#c8a44e` • Background `#f8f7f4`
- **Newspaper Style**: Borders, separators, category ribbons, numbered lists
- **Mobile First**: All components responsive (sm/md/lg breakpoints)
- **SEO Friendly**: Semantic HTML, `Badge` for categories, proper heading hierarchy

---

## 10. Design Notes

- **LocalSection** tab system uses `useState` with `RegionTab` type (`"all" | "tiaret" | "tissemsilt" | "ksar-chellala"`) — ready for dynamic data
- **NewspaperNav** uses recursive `MobileAccordion` for nested mobile menu — supports arbitrary depth
- **EconomySection** directory preview integrated directly into the section (3 items) — main `EconomicDirectoryPreview` component preserved below
- All data remains static/mock — no APIs, no database, no business logic
