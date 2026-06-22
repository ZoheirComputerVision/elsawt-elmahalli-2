import { Badge } from "@/components/ui/badge";
import type { NewsWithIncludes as News } from "@/features/news/types";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
}

const categories = ["الكل", "رياضة", "ثقافة", "اقتصاد", "مجتمع", "تعليم", "صحة"];

export default function LatestNewsGrid({ news }: { news?: News[] }) {
  const items = news ?? [];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
          آخر الأخبار
        </h2>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant="outline"
              className="text-[11px] cursor-pointer hover:bg-navy hover:text-white transition-colors border-gray-300 shrink-0 rounded-sm px-2 py-0.5"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length > 0 ? items.map((item) => (
          <a key={item.id} href={`/news/${item.slug}`} className="bg-white border border-gray-200 rounded-sm overflow-hidden group cursor-pointer hover:border-gold/50 hover:shadow-sm transition-all block">
            <div className="aspect-video bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
              <Badge className="absolute top-2 right-2 bg-navy text-white text-[10px] px-1.5 py-0.5 rounded-sm z-10">
                {item.category?.name ?? "خبر"}
              </Badge>
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="p-3.5">
              <h3 className="text-sm font-bold text-navy leading-snug group-hover:text-gold transition-colors line-clamp-2 mb-2">
                {item.title}
              </h3>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{formatDate(item.publishedAt)}</span>
                <span>{item.viewCount} مشاهدة</span>
              </div>
            </div>
          </a>
        )) : (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-dashed border-gray-200 rounded-sm p-8 flex items-center justify-center text-muted-foreground text-xs h-48">
              لا توجد أخبار
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="px-6 py-2.5 border border-gold text-gold font-bold text-sm hover:bg-gold hover:text-navy transition-colors rounded-sm tracking-wide">
            تحميل المزيد من الأخبار
          </button>
        </div>
      )}
    </section>
  );
}
