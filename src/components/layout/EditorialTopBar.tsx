import { Calendar } from "lucide-react";

const headlines = [
  "افتتاح مشروع تنموي جديد في تيارت",
  "ارتفاع درجات الحرارة خلال الأيام القادمة",
  "انطلاق حملة التلقيح الوطنية",
  "ملتقى دولي حول الاستثمار الفلاحي",
];

function getFullDate() {
  const now = new Date();
  const hijri = now.toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const gregorian = now.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `${hijri} الموافق لـ ${gregorian}`;
}

export default function EditorialTopBar() {
  const fullDate = getFullDate();

  return (
    <div className="bg-navy text-white text-xs">
      <div className="max-w-[90rem] mx-auto px-4 flex items-center h-10">
        {/* ===== Mobile layout ===== */}
        <div className="flex md:hidden items-center gap-2 w-full">
          <span className="bg-[#dc2626] text-white font-bold px-2 py-0.5 rounded text-[10px] shrink-0 leading-normal">
            عاجل
          </span>
          <div className="overflow-hidden flex-1 relative">
            <div className="animate-marquee whitespace-nowrap flex gap-12">
              {[...headlines, ...headlines].map((h, i) => (
                <a
                  key={i}
                  href="#"
                  className="hover:text-gold transition-colors"
                >
                  {h}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Desktop layout ===== */}
        <div className="hidden md:flex items-center w-full gap-0">
          {/* Social icons */}
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <a
              href="#"
              className="hover:text-gold transition-colors p-1"
              aria-label="فيسبوك"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-gold transition-colors p-1"
              aria-label="تويتر"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-gold transition-colors p-1"
              aria-label="يوتيوب"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>

          <div className="w-px h-4 bg-white/15 shrink-0" />

          {/* Weather */}
          <span className="flex items-center gap-1 shrink-0 px-2">☀️ 32°</span>

          <div className="w-px h-4 bg-white/15 shrink-0" />

          {/* Date (independent, shown on large screens) */}
          <span className="hidden lg:flex items-center gap-1.5 shrink-0 px-2 whitespace-nowrap">
            <Calendar className="w-3 h-3" />
            {fullDate}
          </span>

          <div className="w-px h-4 bg-white/15 shrink-0" />

          {/* Breaking news ticker pill */}
          <div className="bg-[#111827] rounded-full px-4 flex-1 max-w-[50%] mx-auto flex items-center gap-2 overflow-hidden h-7">
            <span className="bg-[#dc2626] text-white font-bold px-2 py-0.5 rounded text-[10px] shrink-0 leading-normal">
              عاجل
            </span>
            <div className="overflow-hidden flex-1 relative">
              <div className="animate-marquee whitespace-nowrap flex gap-12">
                {[...headlines, ...headlines].map((h, i) => (
                  <a
                    key={i}
                    href="#"
                    className="hover:text-gold transition-colors"
                  >
                    {h}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="w-px h-4 bg-white/15 shrink-0" />

          {/* RSS */}
          <a
            href="#"
            className="shrink-0 px-2 hover:text-gold transition-colors"
          >
            RSS
          </a>

          <div className="w-px h-4 bg-white/15 shrink-0" />

          {/* Print */}
          <a
            href="#"
            className="shrink-0 px-2 hover:text-gold transition-colors"
          >
            نسخة ورقية
          </a>

          <div className="w-px h-4 bg-white/15 shrink-0" />

          {/* App */}
          <a
            href="#"
            className="shrink-0 px-2 hover:text-gold transition-colors"
          >
            تطبيق جوال
          </a>
        </div>
      </div>
    </div>
  );
}
