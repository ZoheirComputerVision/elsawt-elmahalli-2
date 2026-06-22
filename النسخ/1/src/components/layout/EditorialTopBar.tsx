const headlines = [
  "افتتاح مشروع تنموي جديد في تيارت",
  "ارتفاع درجات الحرارة خلال الأيام القادمة",
  "انطلاق حملة التلقيح الوطنية",
  "ملتقى دولي حول الاستثمار الفلاحي",
];

export default function EditorialTopBar() {
  return (
    <div className="bg-navy text-white text-xs">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-9 gap-4">
        <span className="bg-red-accent text-white font-bold px-2 py-0.5 shrink-0 text-[10px] tracking-wider uppercase">
          عاجل
        </span>

        <div className="hidden md:flex items-center gap-1 overflow-hidden flex-1 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-8 before:bg-gradient-to-l before:from-navy before:to-transparent before:z-10">
          <div className="animate-marquee whitespace-nowrap flex gap-12">
            {[...headlines, ...headlines].map((h, i) => (
              <a key={i} href="#" className="hover:text-gold transition-colors">
                {h}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 mr-auto shrink-0">
          <span>{new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          <span className="flex items-center gap-1">☀️ 32°</span>
          <div className="flex items-center gap-2 mr-2">
            <a href="#" className="hover:text-gold transition-colors" aria-label="فيسبوك">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="hover:text-gold transition-colors" aria-label="تويتر">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="hover:text-gold transition-colors" aria-label="يوتيوب">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
