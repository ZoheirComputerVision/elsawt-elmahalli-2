const trustItems = [
  { text: "مصدر محلي موثوق", desc: "معلومات من عين المكان" },
  { text: "تغطية ميدانية", desc: "مراسلون في كل منطقة" },
  { text: "تحديثات يومية", desc: "أخبار آنية ومستمرة" },
  { text: "محتوى موثق", desc: "مصادر رسمية ومعتمدة" },
];

export default function EditorialTrustLayer() {
  return (
    <div className="bg-gradient-to-l from-navy/5 via-gold/[0.03] to-navy/5 border-b border-gold/10">
      <div className="max-w-[90rem] mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
          {trustItems.map((item) => (
            <div key={item.text} className="flex items-center gap-1.5">
              <span className="text-gold text-sm font-bold" aria-hidden="true">✓</span>
              <span className="text-[11px] md:text-xs text-navy font-semibold whitespace-nowrap">
                {item.text}
              </span>
              <span className="hidden md:inline text-[10px] text-muted-foreground">
                ({item.desc})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
