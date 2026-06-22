import { Badge } from "@/components/ui/badge";
import type { NewsWithIncludes as News } from "@/features/news/types";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
}

function readingTime(body: string | null | undefined): number {
  if (!body) return 1;
  return Math.max(1, Math.ceil(body.split(/\s+/).length / 200));
}

export default function HeroSection({
  main,
  secondary,
}: {
  main?: News | null;
  secondary?: (News | null)[];
}) {
  const mainStory = main;
  const sideStories = (secondary?.filter(Boolean) as News[]) ?? [];

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Main Story — 60% */}
        {mainStory ? (
          <div className="lg:col-span-3 relative group">
            <a
              href={`/news/${mainStory.slug}`}
              className="block relative aspect-[16/10] lg:aspect-[3/2] overflow-hidden bg-gray-100 rounded-sm"
              aria-label={mainStory.title}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                <svg className="w-28 h-28" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute top-0 right-0 z-20">
                <span className="bg-gold text-navy text-xs font-bold px-3 py-1.5 rounded-br-sm block">
                  {mainStory.category?.name ?? "خبر"}
                </span>
              </div>
              {mainStory.viewCount > 0 && (
                <div className="absolute top-0 left-0 z-20">
                  <span className="bg-red-accent text-white text-[10px] font-bold px-2.5 py-1.5 rounded-bl-sm block">
                    حصري
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 right-0 left-0 z-20 p-4 md:p-6">
                <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-2 line-clamp-2">
                  {mainStory.title}
                </h2>
                {mainStory.summary && (
                  <p className="text-sm text-gray-200 line-clamp-2 hidden md:block max-w-2xl leading-relaxed mb-3">
                    {mainStory.summary}
                  </p>
                )}
                <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-wrap" aria-label="تفاصيل المقال">
                  <span>{formatDate(mainStory.publishedAt)}</span>
                  <span className="w-px h-3 bg-gray-600" aria-hidden="true" />
                  <span>{mainStory.viewCount.toLocaleString()} مشاهدة</span>
                  <span className="w-px h-3 bg-gray-600" aria-hidden="true" />
                  <span>{readingTime(mainStory.body)} دقيقة قراءة</span>
                </div>
              </div>
            </a>
          </div>
        ) : (
          <div className="lg:col-span-3 flex items-center justify-center h-64 bg-gray-50 border border-dashed border-gray-200 rounded-sm text-muted-foreground text-sm" role="status">
            لا توجد أخبار حالياً
          </div>
        )}

        {/* Secondary Stories — 40% Desktop */}
        <div className="hidden lg:grid lg:col-span-2 grid-cols-2 gap-3 content-start">
          {sideStories.length > 0 ? sideStories.slice(0, 4).map((item) => (
            <a
              key={item.id}
              href={`/news/${item.slug}`}
              className="group flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden hover:border-gold/50 transition-all hover:shadow-sm focus-visible:outline-2 focus-visible:outline-gold"
              aria-label={item.title}
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-300 overflow-hidden">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-2.5 flex-1 flex flex-col justify-between gap-1">
                <span className="text-[10px] text-gold font-semibold">{item.category?.name ?? ""}</span>
                <h3 className="text-xs font-bold text-navy leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <span className="text-[10px] text-muted-foreground">{formatDate(item.publishedAt)}</span>
              </div>
            </a>
          )) : (
            <div className="col-span-2 flex items-center justify-center h-48 bg-white border border-dashed border-gray-200 rounded-sm text-muted-foreground text-xs" role="status">
              لا توجد أخبار ثانوية
            </div>
          )}
        </div>

        {/* Secondary Stories — Mobile swipeable */}
        <div className="lg:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2 -mx-4 px-4" role="list" aria-label="أخبار ثانوية">
          {sideStories.length > 0 ? sideStories.slice(0, 4).map((item) => (
            <a
              key={item.id}
              href={`/news/${item.slug}`}
              className="snap-start shrink-0 w-64 group bg-white border border-gray-200 rounded-sm overflow-hidden hover:border-gold/50 transition-all"
              role="listitem"
              aria-label={item.title}
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-300 overflow-hidden">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-2.5 flex-1">
                <h3 className="text-sm font-bold text-navy leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <span className="text-[10px] text-muted-foreground">{formatDate(item.publishedAt)}</span>
              </div>
            </a>
          )) : (
            <div className="shrink-0 w-64 flex items-center justify-center h-32 bg-white border border-dashed border-gray-200 rounded-sm text-muted-foreground text-xs" role="status">
              لا توجد أخبار
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
