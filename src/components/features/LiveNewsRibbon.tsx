"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const liveUpdates = [
  { time: "14:32", text: "افتتاح معرض الفلاحة في تيارت", region: "تيارت" },
  { time: "13:15", text: "انطلاق الحملة التطوعية لتنظيف الغابات", region: "تيسمسيلت" },
  { time: "12:40", text: "وزير الداخلية يزور ولاية تيارت", region: "الوطن" },
  { time: "11:55", text: "تسليم 50 سكن اجتماعي في قصر الشلالة", region: "قصر الشلالة" },
  { time: "10:20", text: "ارتفاع في درجات الحرارة خلال الأيام القادمة", region: "الوطن" },
  { time: "09:45", text: "ندوة حول الاستثمار في المنطقة الصناعية", region: "تيارت" },
];

export default function LiveNewsRibbon() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scroll = useCallback((dir: "prev" | "next") => {
    if (!scrollRef.current) return;
    const amount = 250;
    scrollRef.current.scrollBy({
      left: dir === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 1) {
        scrollRef.current.scrollTo({ left: 0, behavior: "instant" });
      } else {
        scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
      }
    }, 3500);
    return () => clearInterval(id);
  }, [isPaused]);

  return (
    <div
      className="bg-[#f8fafc] border-y border-[#e5e7eb]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="آخر التحديثات"
    >
      <div className="max-w-[90rem] mx-auto px-4 flex items-center h-11 gap-3">
        <span className="flex items-center gap-1.5 shrink-0 text-sm font-bold text-red-accent">
          <span className="w-2 h-2 rounded-full bg-red-accent animate-pulse" aria-hidden="true" />
          مباشر
        </span>

        <div className="w-px h-5 bg-gray-300 shrink-0" aria-hidden="true" />

        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto hide-scrollbar flex items-center gap-6"
          tabIndex={0}
          role="list"
          aria-label="أخبار عاجلة"
        >
          {liveUpdates.map((update, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0" role="listitem">
              <span className="text-[11px] font-medium text-gold shrink-0">{update.time}</span>
              <a href="#" className="text-xs text-navy hover:text-gold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-gold rounded-sm">
                {update.text}
              </a>
              <span className="text-[10px] bg-navy/10 text-navy px-1.5 py-0.5 rounded-sm shrink-0 font-medium">
                {update.region}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => scroll("prev")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors focus-visible:outline-2 focus-visible:outline-gold cursor-pointer"
            aria-label="السابق"
          >
            <ChevronRight className="w-4 h-4 text-navy" aria-hidden="true" />
          </button>
          <button
            onClick={() => scroll("next")}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors focus-visible:outline-2 focus-visible:outline-gold cursor-pointer"
            aria-label="التالي"
          >
            <ChevronLeft className="w-4 h-4 text-navy" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
