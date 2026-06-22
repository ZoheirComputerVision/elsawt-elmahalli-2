import { Search } from "lucide-react";

const quickServices = [
  { label: "محليات", href: "/local" },
  { label: "أسعار الوقود", href: "#" },
  { label: "توزيع المياه", href: "#" },
  { label: "انقطاعات الكهرباء", href: "#" },
  { label: "الوظائف", href: "#" },
  { label: "المناقصات", href: "#" },
  { label: "نتائج الامتحانات", href: "#" },
  { label: "الصيدلية المناوبة", href: "#" },
];

export default function NewspaperMasthead() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[90rem] mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-gold text-2xl font-black shrink-0">
              ص
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-4xl md:text-5xl font-black text-navy tracking-tight leading-none">
                الصوت المحلي
              </h1>
              <span className="text-[11px] text-gold font-semibold tracking-[0.08em] uppercase block mt-1">
                The Local Echo
              </span>
            </div>
          </div>

          {/* Search + Quick Services */}
          <div className="flex flex-col items-end gap-3">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="ابحث في الأخبار، الدليل الاقتصادي، الإعلانات..."
                className="w-full pr-9 pl-20 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold bg-gray-50/50"
              />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <button className="absolute left-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-gold text-navy text-xs font-bold rounded-md hover:bg-gold-light transition-colors cursor-pointer">
                بحث
              </button>
            </div>

            {/* Quick Services Pills */}
            <div className="hidden md:flex flex-wrap gap-1.5 justify-end max-w-xs">
              {quickServices.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-full border border-gold/30 text-navy hover:bg-gold hover:text-navy hover:border-gold transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
