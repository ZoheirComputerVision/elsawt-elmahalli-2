import { Badge } from "@/components/ui/badge";
import type { NewsWithIncludes as News } from "@/features/news/types";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {mainStory ? (
          <div className="lg:col-span-3 relative group cursor-pointer">
            <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-gray-100 rounded-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute top-0 right-0 z-20">
                <div className="bg-gold text-navy text-xs font-bold px-4 py-1.5 rounded-br-sm">
                  {mainStory.category?.name ?? "خبر"}
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 left-0 z-20 p-5 md:p-8">
              <div className="flex flex-wrap gap-2 mb-3">
                {mainStory.status === "published" && (
                  <Badge className="bg-red-accent text-white text-xs rounded-sm font-bold border-0">خبر حصري</Badge>
                )}
                {mainStory.region && (
                  <Badge className="bg-black/40 text-white border border-white/20 text-xs rounded-sm backdrop-blur-sm">
                    {mainStory.region.name}
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-3">
                {mainStory.title}
              </h2>
              {mainStory.summary && (
                <p className="text-sm text-gray-200 line-clamp-2 hidden md:block max-w-2xl leading-relaxed">
                  {mainStory.summary}
                </p>
              )}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                <span>{formatDate(mainStory.publishedAt)}</span>
                <span className="w-px h-3 bg-gray-600" />
                <span>{mainStory.viewCount.toLocaleString()} مشاهدة</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3 flex items-center justify-center h-64 bg-gray-50 border border-dashed border-gray-200 rounded-sm text-muted-foreground text-sm">
            لا توجد أخبار حالياً
          </div>
        )}

        <div className="lg:col-span-2 flex flex-col gap-3">
          {sideStories.length > 0 ? sideStories.map((item) => (
            <div key={item.id} className="group cursor-pointer flex gap-3 bg-white border border-gray-200 rounded-sm p-3.5 hover:border-gold/50 transition-all hover:shadow-sm">
              <div className="w-24 h-20 shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm flex items-center justify-center text-gray-300 overflow-hidden">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Badge className="bg-navy/10 text-navy text-[10px] px-1.5 py-0 h-4 rounded-sm font-semibold mb-1">
                    {item.category?.name ?? ""}
                  </Badge>
                  <h3 className="text-sm font-bold text-navy leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                </div>
                <span className="text-[11px] text-muted-foreground">{formatDate(item.publishedAt)}</span>
              </div>
            </div>
          )) : (
            <div className="flex items-center justify-center h-48 bg-white border border-dashed border-gray-200 rounded-sm text-muted-foreground text-xs">
              لا توجد أخبار ثانوية
            </div>
          )}

          {sideStories.length === 0 && (
            <a href="#" className="group flex items-center gap-2 px-3.5 py-2.5 bg-navy/5 border border-dashed border-navy/20 rounded-sm hover:bg-navy/10 transition-colors">
              <span className="text-gold font-bold text-sm">+</span>
              <span className="text-xs text-navy font-semibold group-hover:text-gold transition-colors">
                تصفح جميع الأخبار
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
