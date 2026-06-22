import { Phone, MapPin, Star, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const businesses = [
  { name: "مؤسسة النور للبناء", category: "بناء ومقاولات", phone: "0550 12 34 56", city: "تيارت", rating: 5, members: 120, logo: "ن", color: "bg-blue-100 text-blue-700" },
  { name: "مخبزة الرحمة", category: "مخابز وحلويات", phone: "0551 98 76 54", city: "عين كرمس", rating: 4, members: 45, logo: "ر", color: "bg-amber-100 text-amber-700" },
  { name: "عيادة الأمل", category: "صحة", phone: "0552 34 56 78", city: "تيسمسيلت", rating: 5, members: 28, logo: "ع", color: "bg-green-100 text-green-700" },
  { name: "مطعم الشلالة", category: "مطاعم", phone: "0553 56 78 90", city: "قصر الشلالة", rating: 4, members: 15, logo: "م", color: "bg-red-100 text-red-700" },
  { name: "شركة الأفق للنقل", category: "نقل وشحن", phone: "0554 12 34 56", city: "تيارت", rating: 3, members: 80, logo: "أ", color: "bg-purple-100 text-purple-700" },
  { name: "مكتبة المعرفة", category: "كتب وقرطاسية", phone: "0555 98 76 54", city: "تيسمسيلت", rating: 4, members: 10, logo: "م", color: "bg-teal-100 text-teal-700" },
];

export default function EconomicDirectoryPreview() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-gold" />
          دليل الأعمال
        </h2>
        <Badge className="bg-navy text-white hover:bg-navy-light text-xs cursor-pointer rounded-sm">
          عرض الكل ←
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {businesses.map((biz, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-sm p-4 hover:border-gold/50 hover:shadow-sm transition-all group cursor-pointer">
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg ${biz.color} flex items-center justify-center text-sm font-bold shrink-0 shadow-sm`}>
                {biz.logo}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-navy group-hover:text-gold transition-colors">{biz.name}</h3>
                <Badge className="text-[10px] bg-gray-100 text-muted-foreground hover:bg-gray-200 h-4 px-1.5 mt-0.5 rounded-sm font-normal">
                  {biz.category}
                </Badge>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`w-3 h-3 ${s < biz.rating ? "text-gold fill-gold" : "text-gray-200"}`} />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {biz.city}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {biz.phone}
              </span>
              <span className="mr-auto text-[10px] bg-gold/10 text-gold px-1.5 py-0.5 rounded-sm font-medium">
                {biz.members} عضو
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
