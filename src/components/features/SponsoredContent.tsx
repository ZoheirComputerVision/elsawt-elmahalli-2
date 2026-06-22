import { Badge } from "@/components/ui/badge";

export default function SponsoredContent() {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] bg-red-accent text-white px-1.5 py-0.5 rounded-sm font-bold tracking-wider">
          إعلان
        </span>
        <span className="text-xs text-muted-foreground">• محتوى مدعوم</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="group cursor-pointer bg-white border border-gray-200 rounded-sm overflow-hidden hover:border-gold/50 transition-all hover:shadow-sm">
          <div className="aspect-video bg-gradient-to-br from-navy/5 to-gold/5 flex items-center justify-center relative">
            <span className="text-5xl opacity-20">🏭</span>
            <Badge className="absolute top-2 left-2 bg-red-accent/90 text-white text-[10px] rounded-sm">
              إعلان
            </Badge>
          </div>
          <div className="p-3.5">
            <h3 className="text-sm font-bold text-navy group-hover:text-gold transition-colors leading-snug mb-1">
              فرصة استثمارية في المنطقة الصناعية بتيارت
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              إعلان عن فتح باب الاستثمار في المنطقة الصناعية الجديدة بولاية تيارت...
            </p>
          </div>
        </div>

        <div className="group cursor-pointer bg-white border border-gray-200 rounded-sm overflow-hidden hover:border-gold/50 transition-all hover:shadow-sm">
          <div className="aspect-video bg-gradient-to-br from-navy/5 to-gold/5 flex items-center justify-center relative">
            <span className="text-5xl opacity-20">🏗️</span>
            <Badge className="absolute top-2 left-2 bg-red-accent/90 text-white text-[10px] rounded-sm">
              إعلان
            </Badge>
          </div>
          <div className="p-3.5">
            <h3 className="text-sm font-bold text-navy group-hover:text-gold transition-colors leading-snug mb-1">
              شركة المقاولات الحديثة تعلن عن توظيفات
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              تعلن شركة المقاولات الحديثة عن حاجتها لمهندسين وتقنيين في عدة تخصصات...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

