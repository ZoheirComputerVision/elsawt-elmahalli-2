import { Badge } from "@/components/ui/badge";
import SectionHeader from "@/components/features/SectionHeader";
import type { NewsWithIncludes as News } from "@/features/news/types";

export default function SpecializedSection({ news }: { news?: News[] }) {
  const items = news ?? [];
  const main = items[0];
  const side = items.slice(1, 5);

  if (!main) return null;

  return (
    <section>
      <SectionHeader title="متخصصة" href="/specialized" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 group cursor-pointer">
          <div className="aspect-video bg-gradient-to-br from-purple-50 via-white to-cyan-50 rounded-sm flex items-center justify-center text-gray-300 overflow-hidden relative mb-3">
            <Badge className="absolute top-2 right-2 bg-navy text-white text-[10px] px-2 py-0.5 rounded-sm font-semibold">
              {main.category?.name ?? "خبر"}
            </Badge>
            <span className="text-4xl">🔬</span>
          </div>
          <h3 className="text-base font-bold text-navy leading-snug group-hover:text-gold transition-colors line-clamp-2 mb-1">{main.title}</h3>
          {main.summary && <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{main.summary}</p>}
        </div>
        <div className="lg:col-span-2 divide-y divide-gray-100">
          {side.map((item) => (
            <a key={item.id} href={`/news/${item.slug}`} className="flex items-start gap-2 py-2.5 first:pt-0 last:pb-0 group">
              <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
              <span className="text-sm text-navy leading-snug group-hover:text-gold transition-colors line-clamp-2">{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
