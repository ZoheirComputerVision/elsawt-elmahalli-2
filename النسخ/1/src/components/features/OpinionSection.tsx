import type { NewsWithIncludes as News } from "@/features/news/types";

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
}

export default function OpinionSection({ news }: { news?: News[] }) {
  const items = news ?? [];
  const mainArticle = items[0];
  const sideArticles = items.slice(1, 3);
  const analysisArticle = items[3];

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-5">
        <h2 className="text-xl font-bold text-navy flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
          رأي وتحليل
        </h2>
        <span className="text-[11px] text-muted-foreground">• افتتاحيات • مقالات • تحليلات</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {mainArticle ? (
            <div className="bg-white border-t-4 border-gold shadow-sm rounded-sm overflow-hidden group cursor-pointer">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] bg-navy text-white px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">افتتاحية</span>
                  <span className="text-xs text-muted-foreground">{formatDate(mainArticle.publishedAt)}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-navy leading-snug mb-3 group-hover:text-gold transition-colors">
                  {mainArticle.title}
                </h3>
                {mainArticle.summary && (
                  <p className="text-sm text-muted-foreground leading-[1.8] line-clamp-4">{mainArticle.summary}</p>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-navy font-semibold">✍️ هيئة التحرير</span>
                  <span className="text-xs text-gold font-semibold">قراءة الافتتاحية ←</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-t-4 border-gold shadow-sm rounded-sm p-6 flex items-center justify-center text-muted-foreground text-sm h-40">
              لا توجد افتتاحية
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sideArticles.length > 0 ? sideArticles.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-sm p-5 hover:border-gold/50 hover:shadow-sm transition-all group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {item.title.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy leading-tight">كاتب</p>
                    <p className="text-[10px] text-muted-foreground">كاتب صحفي</p>
                  </div>
                </div>
                <span className="text-[10px] bg-gray-100 text-muted-foreground px-1.5 py-0.5 rounded-sm font-semibold mb-2 inline-block">مقال رأي</span>
                <h3 className="text-sm font-bold text-navy leading-snug mb-2 group-hover:text-gold transition-colors line-clamp-2">{item.title}</h3>
                {item.summary && <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.summary}</p>}
              </div>
            )) : (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white border border-dashed border-gray-200 rounded-sm p-5 flex items-center justify-center text-muted-foreground text-xs h-32">
                  لا توجد مقالات
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden group cursor-pointer hover:border-gold/50 hover:shadow-sm transition-all">
          <div className="bg-gradient-to-r from-navy to-navy-light px-5 py-3">
            <span className="text-[10px] text-gold font-bold uppercase tracking-wider">تحليل</span>
          </div>
          <div className="p-5">
            {analysisArticle ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center text-sm font-bold shadow-sm">
                    {analysisArticle.title.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy leading-tight">محلل</p>
                    <p className="text-[10px] text-muted-foreground">خبير اقتصادي</p>
                  </div>
                </div>
                <h3 className="text-base font-bold text-navy leading-snug mb-3 group-hover:text-gold transition-colors">{analysisArticle.title}</h3>
                {analysisArticle.summary && (
                  <p className="text-sm text-muted-foreground leading-[1.7] line-clamp-6">{analysisArticle.summary}</p>
                )}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <span className="text-[11px] text-muted-foreground">{formatDate(analysisArticle.publishedAt)}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-[11px] text-gold font-semibold">قراءة التحليل</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-xs">لا يوجد تحليل</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
