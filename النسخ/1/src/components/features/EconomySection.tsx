import { Badge } from "@/components/ui/badge";
import type { NewsWithIncludes as News } from "@/features/news/types";

const sectors = [
  { icon: "📈", name: "استثمار", desc: "فرص استثمارية في المناطق الصناعية والفلاحية", color: "bg-blue-50 border-blue-200", iconBg: "bg-blue-100" },
  { icon: "🌾", name: "فلاحة", desc: "الموسم الفلاحي، المحاصيل، البرامج الداعمة", color: "bg-green-50 border-green-200", iconBg: "bg-green-100" },
  { icon: "🏭", name: "صناعة", desc: "المناطق الصناعية، المصانع، المشاريع الإنتاجية", color: "bg-amber-50 border-amber-200", iconBg: "bg-amber-100" },
  { icon: "💼", name: "تشغيل", desc: "فرص العمل، منح، توظيف، مسابقات وطنية", color: "bg-purple-50 border-purple-200", iconBg: "bg-purple-100" },
];

const directoryItems = [
  { name: "مؤسسة النور للبناء", category: "بناء", city: "تيارت", phone: "0550 12 34 56" },
  { name: "مخبزة الرحمة", category: "مخابز", city: "عين كرمس", phone: "0551 98 76 54" },
  { name: "عيادة الأمل", category: "صحة", city: "تيسمسيلت", phone: "0552 34 56 78" },
];

export default function EconomySection({ news }: { news?: News[] }) {
  const items = news ?? [];
  const econCount = items.length;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-5">
        <h2 className="text-xl font-bold text-navy flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
          اقتصاد
        </h2>
        <span className="text-[11px] text-muted-foreground">• استثمار • فلاحة • صناعة • تشغيل</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {sectors.map((sector) => (
          <div key={sector.name} className={`${sector.color} border rounded-sm p-4 group cursor-pointer hover:shadow-sm transition-all`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`${sector.iconBg} w-10 h-10 rounded-lg flex items-center justify-center text-lg`}>
                {sector.icon}
              </span>
              <Badge className="bg-white/80 text-navy text-[10px] font-bold border-0">{econCount} خبر</Badge>
            </div>
            <h3 className="text-sm font-bold text-navy mb-1 group-hover:text-gold transition-colors">{sector.name}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{sector.desc}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-navy flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gold" />
            الدليل الاقتصادي
          </h3>
          <Badge className="bg-navy text-white hover:bg-navy-light text-[10px] cursor-pointer rounded-sm">
            عرض الدليل الكامل ←
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {directoryItems.map((biz, i) => (
            <div key={i} className="bg-white border border-dashed border-gray-200 rounded-sm p-3 hover:border-gold/50 hover:bg-gold/5 transition-all group cursor-pointer flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center text-navy font-bold text-xs shrink-0 group-hover:bg-gold/20 transition-colors">
                {biz.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-navy leading-tight group-hover:text-gold transition-colors">{biz.name}</p>
                <p className="text-[10px] text-muted-foreground">{biz.category} • {biz.city}</p>
                <p className="text-[10px] text-gold font-semibold">{biz.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {items.length > 0 && (
        <div className="mt-5 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gold" />
            آخر أخبار الاقتصاد
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {items.slice(0, 4).map((item) => (
              <a key={item.id} href="#" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-sm transition-colors group">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                <span className="text-sm text-navy font-medium group-hover:text-gold transition-colors line-clamp-1">{item.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
