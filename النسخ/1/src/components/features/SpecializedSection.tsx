import { Badge } from "@/components/ui/badge";
import type { NewsWithIncludes as News } from "@/features/news/types";

const specialSections = [
  { name: "رياضة", icon: "⚽", color: "bg-emerald-50 border-emerald-200", iconBg: "bg-emerald-100", desc: "كرة القدم، الفروسية، الرياضات الجماعية" },
  { name: "ثقافة", icon: "🎭", color: "bg-purple-50 border-purple-200", iconBg: "bg-purple-100", desc: "مهرجانات، معارض، تراث، فنون تشكيلية" },
  { name: "تعليم", icon: "📚", color: "bg-blue-50 border-blue-200", iconBg: "bg-blue-100", desc: "جامعات، مدارس، تكوين مهني، منح" },
  { name: "صحة", icon: "🏥", color: "bg-red-50 border-red-200", iconBg: "bg-red-100", desc: "مستشفيات، حملات تلقيح، وقاية" },
  { name: "تكنولوجيا", icon: "💻", color: "bg-cyan-50 border-cyan-200", iconBg: "bg-cyan-100", desc: "رقمنة، منصات، ابتكارات، ذكاء اصطناعي" },
];

export default function SpecializedSection({ news }: { news?: News[] }) {
  const count = news?.length ?? 0;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-5">
        <h2 className="text-xl font-bold text-navy flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
          متخصصة
        </h2>
        <span className="text-[11px] text-muted-foreground">• رياضة • ثقافة • تعليم • صحة • تكنولوجيا</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {specialSections.map((sec) => (
          <div key={sec.name} className={`${sec.color} border rounded-sm p-4 group cursor-pointer hover:shadow-sm transition-all`}>
            <div className={`${sec.iconBg} w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 shadow-sm`}>
              {sec.icon}
            </div>
            <h3 className="text-sm font-bold text-navy mb-1 group-hover:text-gold transition-colors">{sec.name}</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-2">{sec.desc}</p>
            <Badge className="bg-white/80 text-navy text-[10px] font-bold border-0">{count} مقال</Badge>
          </div>
        ))}
      </div>
    </section>
  );
}
