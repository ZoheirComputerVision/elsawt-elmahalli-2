export default function RegionalCoverageMap({
  regions,
}: {
  regions: { name: string; slug: string; articlesCount: number; latestUpdate: string | null }[];
}) {
  return (
    <section className="my-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base font-bold text-navy">التغطية الجهوية</span>
        <div className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" aria-hidden="true" />
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 bg-gradient-to-br from-navy/5 to-navy/[0.02] border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg" aria-hidden="true">🗺️</span>
            <span className="text-sm font-bold text-navy">منطقة التغطية</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            3 ولايات و 42 بلدية تحت التغطية الإعلامية
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {regions.map((r) => (
            <div
              key={r.slug}
              className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-xs" aria-hidden="true">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <span className="text-sm font-bold text-navy block">{r.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {r.articlesCount} مقال • آخر تحديث: {r.latestUpdate ?? "---"}
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-sm font-medium">
                3 مراسلين
              </span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 bg-navy/5 border-t border-gray-100">
          <a
            href="/coverage"
            className="text-[11px] text-gold hover:text-navy font-semibold transition-colors flex items-center justify-between focus-visible:outline-2 focus-visible:outline-gold rounded-sm"
          >
            <span>خريطة التغطية الكاملة</span>
            <span aria-hidden="true">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
