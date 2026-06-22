import { Badge } from "@/components/ui/badge";

const quickNews = [
  "ارتفاع في درجة الحرارة يوم الخميس",
  "افتتاح معرض للصناعات التقليدية بتيارت",
  "تأجيل موعد الامتحانات الرسمية",
  "إطلاق منصة رقمية للخدمات الإدارية",
  "ندوة حول الاستثمار الفلاحي",
];

const mostRead = [
  { title: "والي تيارت يشرف على تدشين مشروع مائي جديد", views: 1542 },
  { title: "فوز شباب تيارت في دورة كرة القدم الجهوية", views: 1287 },
  { title: "إعلان عن مناقصة لبناء مدرسة جديدة", views: 1103 },
  { title: "ملتقى حول السياحة الداخلية بتيسمسيلت", views: 976 },
  { title: "قافلة طبية تجوب قرى قصر الشلالة", views: 845 },
];

export default function Sidebar() {
  return (
    <aside className="space-y-5">
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="bg-navy text-white px-4 py-2.5">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-gold rounded-full" />
            أخبار سريعة
          </h3>
        </div>
        <div className="p-3">
          <ul className="space-y-2">
            {quickNews.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                <span className="text-muted-foreground hover:text-navy cursor-pointer transition-colors leading-snug">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="bg-navy text-white px-4 py-2.5">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-gold rounded-full" />
            الأكثر قراءة
          </h3>
        </div>
        <div className="p-3">
          <ol className="space-y-3">
            {mostRead.map((item, i) => (
              <li key={i} className="flex items-start gap-3 pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                <span className={`font-black text-lg leading-none mt-0.5 w-6 text-center shrink-0 ${
                  i === 0 ? "text-gold" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-700" : "text-gray-300"
                }`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy leading-snug line-clamp-2 cursor-pointer hover:text-gold transition-colors">
                    {item.title}
                  </p>
                  <span className="text-[11px] text-muted-foreground">{item.views} مشاهدة</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bg-gradient-to-br from-navy/5 via-white to-gold/5 border border-dashed border-gold/30 rounded-sm p-5 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <Badge className="bg-navy/10 text-navy hover:bg-navy/20 text-xs mb-2 rounded-sm">
            مساحة إعلانية
          </Badge>
          <p className="text-sm text-muted-foreground leading-relaxed">
            إعلانك هنا
            <br />
            <span className="text-gold font-semibold">اتصل بنا للإعلان</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
