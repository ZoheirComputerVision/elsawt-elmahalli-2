import { Search } from "lucide-react";

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

function getArabicDate() {
  return new Date().toLocaleDateString("ar-SA", dateOptions);
}

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-2 text-xs text-muted-foreground border-b border-gray-100">
          <span>{getArabicDate()}</span>
          <span className="flex items-center gap-1">
            <span>☀️</span> 32° — تيارت
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between py-6 gap-4">
          <div className="text-center md:text-right">
            <h1 className="text-4xl md:text-5xl font-black text-navy tracking-tight">
              الصوت المحلي
            </h1>
            <p className="text-xs text-gold font-semibold tracking-widest mt-1">
              إهتمام محلي ... إلتزام وطني
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="ابحث في الأخبار..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gold bg-gray-50"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
