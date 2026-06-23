import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCoveragePage() {
  const [wilayas, coverageData] = await Promise.all([
    prisma.wilaya.findMany({
      include: {
        dairas: {
          include: {
            communes: {
              include: {
                _count: { select: { news: { where: { status: "published" } }, reporters: { where: { active: true } }, directories: { where: { status: "active" } }, ads: { where: { status: "active" } } } },
              },
            },
          },
        },
      },
    }),
    prisma.$queryRaw<{ status: string; count: bigint }[]>`SELECT status, COUNT(*)::int as count FROM news GROUP BY status`,
  ]);

  const totalNews = coverageData.reduce((s, r) => s + Number(r.count), 0);

  return (
    <div>
      <h1 className="text-xl font-bold text-navy mb-6">التغطية الإعلامية</h1>

      <div className="grid grid-cols-1 gap-6">
        {wilayas.map((wilaya) => {
          const totalDairas = wilaya.dairas.length;
          const totalCommunes = wilaya.dairas.reduce((s, d) => s + d.communes.length, 0);
          const totalNewsW = wilaya.dairas.reduce((s, d) => s + d.communes.reduce((s2, c) => s2 + c._count.news, 0), 0);
          const totalReporters = wilaya.dairas.reduce((s, d) => s + d.communes.reduce((s2, c) => s2 + c._count.reporters, 0), 0);
          const totalDirectories = wilaya.dairas.reduce((s, d) => s + d.communes.reduce((s2, c) => s2 + c._count.directories, 0), 0);
          const totalAds = wilaya.dairas.reduce((s, d) => s + d.communes.reduce((s2, c) => s2 + c._count.ads, 0), 0);
          const coveredCommunes = wilaya.dairas.reduce((s, d) => s + d.communes.filter((c) => c._count.reporters > 0).length, 0);
          const coveragePct = totalCommunes > 0 ? Math.round((coveredCommunes / totalCommunes) * 100) : 0;

          return (
            <div key={wilaya.id} className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <div className="bg-navy text-white px-4 py-3 flex items-center justify-between">
                <h2 className="text-sm font-bold">{wilaya.name}</h2>
                <span className="text-[10px] text-gold">{totalDairas} دوائر | {totalCommunes} بلديات</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-gray-50 border-b border-gray-200 text-center">
                <div><span className="text-lg font-black text-navy">{totalNewsW}</span><p className="text-[10px] text-muted-foreground">أخبار</p></div>
                <div><span className="text-lg font-black text-green-600">{totalReporters}</span><p className="text-[10px] text-muted-foreground">مراسلين</p></div>
                <div><span className="text-lg font-black text-amber-600">{totalDirectories}</span><p className="text-[10px] text-muted-foreground">دليل</p></div>
                <div><span className="text-lg font-black text-blue-600">{totalAds}</span><p className="text-[10px] text-muted-foreground">إعلانات</p></div>
                <div>
                  <span className={`text-lg font-black ${coveragePct >= 50 ? "text-green-600" : coveragePct > 0 ? "text-amber-600" : "text-red-500"}`}>{coveragePct}%</span>
                  <p className="text-[10px] text-muted-foreground">تغطية</p>
                </div>
              </div>

              {wilaya.dairas.map((daira) => {
                const dairaNews = daira.communes.reduce((s, c) => s + c._count.news, 0);
                const dairaReporters = daira.communes.reduce((s, c) => s + c._count.reporters, 0);
                const dairaCovered = daira.communes.filter((c) => c._count.reporters > 0).length;

                return (
                  <div key={daira.id} className="border-b border-gray-100 last:border-0">
                    <div className="px-4 py-2 bg-gray-50/50 flex items-center justify-between text-xs">
                      <span className="font-bold text-navy">{daira.name}</span>
                      <span className="text-muted-foreground">{daira.communes.length} بلديات | {dairaReporters} مراسلين | {dairaNews} خبر</span>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-1 px-4 py-2">
                      {daira.communes.map((commune) => {
                        const hasReporter = commune._count.reporters > 0;
                        const hasNews = commune._count.news > 0;
                        return (
                          <div
                            key={commune.id}
                            className={`text-[9px] text-center p-1 rounded-sm ${hasReporter ? "bg-green-100 text-green-800" : hasNews ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-400"}`}
                            title={`${commune.name}: ${commune._count.reporters} مراسلين, ${commune._count.news} أخبار`}
                          >
                            <span className="block truncate font-semibold">{commune.name}</span>
                            <span>{commune._count.news}خ | {commune._count.reporters}م</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-sm p-4">
        <h3 className="text-sm font-bold text-navy mb-3">إحصاءات عامة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-black text-navy">{totalNews}</p>
            <p className="text-[10px] text-muted-foreground">إجمالي الأخبار</p>
          </div>
          <div>
            <p className="text-2xl font-black text-navy">{coverageData.find((r) => r.status === "published")?.count ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">منشور</p>
          </div>
          <div>
            <p className="text-2xl font-black text-amber-600">{coverageData.find((r) => r.status === "review")?.count ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">قيد المراجعة</p>
          </div>
          <div>
            <p className="text-2xl font-black text-green-600">{coverageData.find((r) => r.status === "approved")?.count ?? 0}</p>
            <p className="text-[10px] text-muted-foreground">معتمد</p>
          </div>
        </div>
      </div>
    </div>
  );
}
