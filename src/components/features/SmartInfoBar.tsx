function timeAgo(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "أقل من دقيقة";
  if (minutes < 60) return `منذ ${minutes} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

export default function SmartInfoBar({
  todayNewsCount,
  latestDate,
}: {
  todayNewsCount: number;
  latestDate: Date | null;
}) {
  return (
    <div className="bg-gradient-to-l from-navy/5 via-gold/5 to-navy/5 border-y border-gold/20">
      <div className="max-w-[90rem] mx-auto px-4 flex items-center justify-center gap-5 md:gap-10 text-xs md:text-sm py-2 flex-wrap">
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          🌡️ 32°
        </span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          ⛽ 45.97 دج
        </span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          📰 {todayNewsCount} خبراً اليوم
        </span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          🏛️ 42 بلدية
        </span>
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          🕒 آخر تحديث {latestDate ? timeAgo(new Date(latestDate)) : "---"}
        </span>
      </div>
    </div>
  );
}
