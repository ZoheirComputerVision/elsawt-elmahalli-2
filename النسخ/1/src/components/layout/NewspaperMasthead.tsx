import { Search } from "lucide-react";

export default function NewspaperMasthead() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-gold text-2xl font-black shrink-0">
              ص
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-4xl md:text-5xl font-black text-navy tracking-tight leading-none">
                الصوت المحلي
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-gold font-semibold tracking-[0.2em] uppercase">
                  Elsawt Elmahalli
                </span>
                <span className="w-px h-3 bg-gray-300" />
                <span className="text-[11px] text-muted-foreground">
                  سنة التأسيس 2026
                </span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث..."
                className="w-56 pr-9 pl-3 py-1.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gold bg-gray-50/50"
              />
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-[10px] text-muted-foreground border-r border-gray-200 pr-3">
              العدد الرقمي<br />
              <span className="text-gold font-bold text-xs">2026</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
