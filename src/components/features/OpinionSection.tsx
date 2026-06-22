import SectionHeader from "@/components/features/SectionHeader";
import type { NewsWithIncludes as News } from "@/features/news/types";

export default function OpinionSection({ news }: { news?: News[] }) {
  const items = news ?? [];
  const main = items[0];
  const side = items.slice(1, 5);

  if (!main) return null;

  return (
    <section>
      <SectionHeader title="رأي وتحليل" href="/opinion" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white border-t-4 border-gold shadow-sm rounded-sm overflow-hidden group cursor-pointer">
          <div className="p-4">
            <span className="text-[10px] bg-navy text-white px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider inline-block mb-3">افتتاحية</span>
            <h3 className="text-lg font-black text-navy leading-snug mb-2 group-hover:text-gold transition-colors">{main.title}</h3>
            {main.summary && <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{main.summary}</p>}
            <span className="text-xs text-gold font-semibold mt-2 inline-block">قراءة الافتتاحية ←</span>
          </div>
        </div>
        <div className="lg:col-span-2 divide-y divide-gray-100">
          {side.length > 0 ? side.map((item) => (
            <a key={item.id} href={`/news/${item.slug}`} className="flex items-start gap-2 py-2.5 first:pt-0 last:pb-0 group">
              <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
              <span className="text-sm text-navy leading-snug group-hover:text-gold transition-colors line-clamp-2">{item.title}</span>
            </a>
          )) : (
            <div className="flex items-center justify-center h-24 text-gray-400 text-xs">لا توجد مقالات</div>
          )}
        </div>
      </div>
    </section>
  );
}
