const services = [
  { icon: "⛽", title: "أسعار الوقود", desc: "متابعة أسعار المحروقات", href: "#" },
  { icon: "💧", title: "المياه", desc: "حالة التوزيع والانقطاعات", href: "#" },
  { icon: "⚡", title: "الكهرباء", desc: "أوقات انقطاع التيار", href: "#" },
  { icon: "🚌", title: "النقل", desc: "مواعيد و خطوط النقل", href: "#" },
  { icon: "🏥", title: "المناوبة الصحية", desc: "الصيدليات و المستشفيات", href: "#" },
  { icon: "💼", title: "الوظائف", desc: "إعلانات التوظيف و المناصب", href: "#" },
];

export default function LocalServiceDashboard() {
  return (
    <section className="my-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base font-bold text-navy">الخدمات المحلية</span>
        <div className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {services.map((s) => (
          <a
            key={s.title}
            href={s.href}
            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gold/50 hover:shadow-sm transition-all group focus-visible:outline-2 focus-visible:outline-gold"
            aria-label={`${s.title} — ${s.desc}`}
          >
            <span className="text-xl shrink-0" aria-hidden="true">{s.icon}</span>
            <div>
              <span className="text-sm font-bold text-navy group-hover:text-gold transition-colors block">{s.title}</span>
              <span className="text-[10px] text-muted-foreground">{s.desc}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
