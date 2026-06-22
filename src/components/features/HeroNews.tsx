import { Badge } from "@/components/ui/badge";

interface HeroNewsProps {
  title?: string;
  summary?: string;
  category?: string;
  date?: string;
}

const placeholder = {
  title: "افتتاح مشروع تنموي جديد في ولاية تيارت لدعم الاستثمار المحلي",
  summary:
    "أشرف والي ولاية تيارت على مراسم تدشين مشروع تنموي جديد يهدف إلى دفع عجلة الاستثمار وتوفير فرص عمل للشباب في مختلف بلديات الولاية، بحضور عدد من المنتخبين والسلطات المحلية.",
  category: "تيارت",
  date: "2026-06-20",
};

export default function HeroNews({
  title = placeholder.title,
  summary = placeholder.summary,
  category = placeholder.category,
  date = placeholder.date,
}: HeroNewsProps) {
  return (
    <section className="mb-8">
      <div className="newspaper-line" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 relative group cursor-pointer">
          <div className="relative aspect-[16/9] lg:aspect-[16/10] overflow-hidden bg-gray-100">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 left-0 z-20 p-4 md:p-6">
            <Badge className="bg-gold text-navy hover:bg-gold-light mb-2 text-xs font-bold">
              {category}
            </Badge>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2">
              {title}
            </h2>
            <p className="text-sm text-gray-200 line-clamp-2 hidden md:block">
              {summary}
            </p>
            <span className="text-xs text-gray-400 mt-2 inline-block">{date}</span>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group cursor-pointer flex gap-3 border-b border-gray-100 pb-3 last:border-0">
              <div className="w-24 h-20 shrink-0 bg-gray-100 flex items-center justify-center text-gray-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-navy leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                  عنوان الخبر الجانبي يظهر هنا في سطرين كحد أقصى
                </h3>
                <span className="text-xs text-muted-foreground mt-1 inline-block">
                  20 يونيو 2026
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
