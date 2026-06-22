import type { NewsWithIncludes } from "@/features/news/types";

function getTrend(viewCount: number, avg: number): { direction: "up" | "down" | "stable"; percent: number } {
  if (avg === 0) return { direction: "stable", percent: 0 };
  const diff = ((viewCount - avg) / avg) * 100;
  if (Math.abs(diff) < 5) return { direction: "stable", percent: 0 };
  return { direction: diff > 0 ? "up" : "down", percent: Math.abs(Math.round(diff)) };
}

export default function TrendingBar({ news }: { news: NewsWithIncludes[] }) {
  if (!news.length) return null;

  const avgViewCount = news.reduce((s, n) => s + n.viewCount, 0) / news.length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg my-5">
      <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-gray-100">
        <div className="w-1.5 h-5 bg-gold rounded-full shrink-0" aria-hidden="true" />
        <span className="text-sm font-bold text-navy">الأكثر قراءة خلال 24 ساعة</span>
        <div className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" aria-hidden="true" />
      </div>
      <div className="px-4 pb-2 divide-y divide-gray-100">
        {news.slice(0, 5).map((item, i) => {
          const trend = getTrend(item.viewCount, avgViewCount);
          return (
            <a
              key={item.id}
              href={`/news/${item.slug}`}
              className="flex items-center gap-3 py-2.5 group focus-visible:outline-2 focus-visible:outline-gold rounded-sm"
              aria-label={`${item.title} — ${item.viewCount.toLocaleString()} مشاهدة`}
            >
              <span className="w-7 h-7 rounded-full bg-navy text-gold text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-navy transition-colors">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-navy group-hover:text-gold transition-colors line-clamp-1 font-medium">
                  {item.title}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {item.viewCount.toLocaleString()} مشاهدة
                </span>
              </div>
              <span
                className={`text-[11px] font-bold shrink-0 flex items-center gap-0.5 ${
                  trend.direction === "up"
                    ? "text-green-600"
                    : trend.direction === "down"
                      ? "text-red-500"
                      : "text-gray-400"
                }`}
                aria-label={
                  trend.direction === "stable"
                    ? "مستقر"
                    : `${trend.percent}% ${trend.direction === "up" ? "ارتفاع" : "انخفاض"}`
                }
              >
                {trend.direction === "up" && "▲"}
                {trend.direction === "down" && "▼"}
                {trend.direction === "stable" && "–"}
                {trend.direction !== "stable" && ` ${trend.percent}%`}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
