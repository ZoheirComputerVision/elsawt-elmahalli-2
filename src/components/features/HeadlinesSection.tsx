import Link from "next/link";
import type { NewsWithIncludes as News } from "@/features/news/types";

function timeAgo(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "منذ لحظات";
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

export default function HeadlinesSection({ news }: { news?: News[] }) {
  const headlines = news ?? [];

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-accent animate-pulse" />
          <h2 className="text-lg font-bold text-navy">أبرز العناوين</h2>
        </div>
        <span className="w-px h-5 bg-gray-300" />
        <span className="text-[11px] text-muted-foreground">آخر التحديثات</span>
      </div>

      <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
        {headlines.length > 0 ? headlines.map((item, i) => (
          <a
            key={item.id}
            href={`/news/${item.slug}`}
            className={`flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors group
              ${i < headlines.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            <span className="w-7 h-7 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-navy transition-colors">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-navy leading-snug group-hover:text-gold transition-colors">
                {item.title}
              </h3>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <span className="text-[10px] bg-navy/10 text-navy px-1.5 py-0.5 rounded-sm font-medium">
                {item.category?.name ?? ""}
              </span>
              <span className="text-[11px] text-muted-foreground">{timeAgo(item.publishedAt)}</span>
            </div>
          </a>
        )) : (
          <div className="px-4 py-6 text-center text-muted-foreground text-sm">
            لا توجد عناوين حالياً
          </div>
        )}
      </div>

      <Link href="/news" className="inline-flex items-center gap-1 text-xs text-gold hover:text-navy font-semibold mt-3 transition-colors">
        عرض جميع العناوين ←
      </Link>
    </section>
  );
}
