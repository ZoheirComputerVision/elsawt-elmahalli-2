import { Badge } from "@/components/ui/badge";
import type { NewsWithIncludes as News } from "@/features/news/types";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
}

export default function NationalSection({ news }: { news?: News[] }) {
  const items = news ?? [];

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-5">
        <h2 className="text-xl font-bold text-navy flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
          الوطن
        </h2>
        <span className="text-[11px] text-muted-foreground">• أخبار وطنية</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.length > 0 ? items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-sm overflow-hidden group cursor-pointer hover:border-gold/50 hover:shadow-sm transition-all">
            <div className="aspect-[16/9] bg-gradient-to-br from-navy/5 via-gray-50 to-gold/5 flex items-center justify-center relative">
              <Badge className="absolute top-2 right-2 bg-navy text-white text-[10px] px-2 py-0.5 rounded-sm font-semibold">
                {item.category?.name ?? "خبر"}
              </Badge>
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="p-3.5">
              <h3 className="text-sm font-bold text-navy leading-snug group-hover:text-gold transition-colors line-clamp-2 mb-1.5">
                {item.title}
              </h3>
              {item.summary && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.summary}</p>
              )}
              <span className="text-[11px] text-gray-400 mt-2 inline-block">{formatDate(item.publishedAt)}</span>
            </div>
          </div>
        )) : (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-dashed border-gray-200 rounded-sm p-6 flex items-center justify-center text-muted-foreground text-xs h-48">
              لا توجد أخبار
            </div>
          ))
        )}
      </div>
    </section>
  );
}
