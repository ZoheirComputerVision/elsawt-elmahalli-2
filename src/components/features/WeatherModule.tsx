const weather = {
  temp: 32,
  feelsLike: 35,
  condition: "مشمس",
  wind: "12 كم/س",
  humidity: "45%",
  sunrise: "05:38",
  sunset: "19:52",
};

export default function WeatherModule() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg my-5">
      <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-gray-100" role="heading" aria-level={2}>
        <span className="text-sm font-bold text-navy">حالة الطقس</span>
        <span className="text-[10px] text-muted-foreground">تيارت</span>
        <div className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" aria-hidden="true" />
      </div>
      <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">☀️</span>
          <div>
            <span className="text-2xl font-black text-navy">{weather.temp}°</span>
            <span className="text-xs text-muted-foreground mr-1">{weather.condition}</span>
            <span className="text-[10px] text-muted-foreground block">يشعر بـ {weather.feelsLike}°</span>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6 text-xs" aria-label="تفاصيل الطقس">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground" aria-hidden="true">💨</span>
            <span className="text-navy font-medium">{weather.wind}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground" aria-hidden="true">💧</span>
            <span className="text-navy font-medium">{weather.humidity}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground" aria-hidden="true">🌅</span>
            <span className="text-navy font-medium">{weather.sunrise}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground" aria-hidden="true">🌇</span>
            <span className="text-navy font-medium">{weather.sunset}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
