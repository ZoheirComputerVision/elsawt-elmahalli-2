interface RegionCard {
  title: string;
  summary: string;
  image?: string;
  date: string;
}

const regions = [
  {
    name: "تيارت",
    color: "border-r-gold",
    news: [
      { title: "تدشين مشروع مائي جديد في عين كرمس", summary: "يستفيد منه أكثر من 10 آلاف مواطن في المناطق الريفية", date: "2026-06-20" },
      { title: "ملتقى جهوي حول التنمية المحلية", summary: "يناقش آليات تحسين الخدمات البلدية", date: "2026-06-19" },
      { title: "افتتاح معرض الصناعات التقليدية", summary: "بمشاركة 50 عارضاً من مختلف بلديات الولاية", date: "2026-06-18" },
    ],
  },
  {
    name: "تيسمسيلت",
    color: "border-r-blue-500",
    news: [
      { title: "انطلاق حملة التشجير في برج بونعامة", summary: "مبادرة بيئية بمشاركة المجتمع المدني", date: "2026-06-20" },
      { title: "قافلة تضامنية لمساعدة العائلات المعوزة", summary: "تشمل توزيع مواد غذائية وأغطية", date: "2026-06-18" },
      { title: "دورة تكوينية في الإسعافات الأولية", summary: "لصالح متطوعي الحماية المدنية", date: "2026-06-17" },
    ],
  },
  {
    name: "قصر الشلالة",
    color: "border-r-emerald-500",
    news: [
      { title: "قافلة طبية تجوب المنطقة", summary: "تقدم خدمات الكشف المبكر والعلاج المجاني للمواطنين", date: "2026-06-19" },
      { title: "مهرجان الفروسية التقليدية", summary: "تنظيم الطبعة الثانية بمشاركة فرسان من عدة ولايات", date: "2026-06-17" },
      { title: "حملة تحسيسية حول السلامة المرورية", summary: "تنظيم أيام تحسيسية لفائدة سائقي الطرقات", date: "2026-06-16" },
    ],
  },
];

function RegionCard({ region }: { region: (typeof regions)[0] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:border-gold/50 hover:shadow-sm transition-all">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-gray-100">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-navy text-white text-xs font-bold">
          {region.name.charAt(0)}
        </div>
        <h3 className="text-base font-bold text-navy">{region.name}</h3>
        <span className="mr-auto text-[10px] text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-sm">
          {region.news.length} خبر
        </span>
      </div>
      <div className="p-4 space-y-3">
        {region.news.map((item, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-navy leading-snug group-hover:text-gold transition-colors mb-0.5">
                  {item.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
                  {item.summary}
                </p>
                <span className="text-[10px] text-gray-400 mt-0.5 inline-block">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <a
        href={`/${region.name}`}
        className="block text-center py-2 text-xs font-semibold text-gold hover:bg-gold/5 transition-colors border-t border-gray-100"
      >
        المزيد من أخبار {region.name} ←
      </a>
    </div>
  );
}

export default function LocalNewsSection() {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
        أخبار المناطق
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((region) => (
          <RegionCard key={region.name} region={region} />
        ))}
      </div>
    </section>
  );
}
