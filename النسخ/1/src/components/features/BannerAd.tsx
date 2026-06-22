export default function BannerAd() {
  return (
    <section className="my-6">
      <div className="bg-gradient-to-r from-navy/5 via-gold/5 to-navy/5 border border-dashed border-gold/30 rounded-sm text-center py-8 md:py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(200,164,78,0.08),transparent_70%)]" />
        <div className="relative z-10">
          <span className="text-[10px] text-muted-foreground tracking-widest uppercase block mb-2">إعلان</span>
          <div className="max-w-xl mx-auto">
            <p className="text-navy font-semibold text-lg md:text-xl mb-1">
              مساحة إعلانية متاحة
            </p>
            <p className="text-sm text-muted-foreground">
              اتصل بفريق التسويق للإعلان في هذه المساحة المميزة
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
