import { Badge } from "@/components/ui/badge";
import SectionHeader from "@/components/features/SectionHeader";
import type { NewsWithIncludes as News } from "@/features/news/types";

export default function NationalSection({ news }: { news?: News[] }) {
  const items = news ?? [];
  const main = items[0];
  const side = items.slice(1, 5);

  if (!main) return null;

  return (
    <section>
      <SectionHeader title="الوطن" href="/nation" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 group cursor-pointer">
          <div className="aspect-video bg-gradient-to-br from-navy/5 via-gray-50 to-gold/5 rounded-sm flex items-center justify-center text-gray-300 overflow-hidden relative mb-3">
            <Badge className="absolute top-2 right-2 bg-navy text-white text-[10px] px-2 py-0.5 rounded-sm font-semibold">
              {main.category?.name ?? "خبر"}
            </Badge>
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
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
