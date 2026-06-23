import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReporterRankingPage() {
  const reporters = await prisma.user.findMany({
    where: { role: "REPORTER", active: true },
    select: {
      id: true, name: true, avatar: true, specialization: true, lastLoginAt: true, createdAt: true,
      commune: { select: { name: true, daira: { select: { name: true, wilaya: { select: { name: true, slug: true } } } } } },
      _count: { select: { news: { where: { status: "published" } } } },
    },
  });

  const ranked = reporters
    .map((r) => ({
      name: r.name, avatar: r.avatar, specialization: r.specialization,
      commune: r.commune?.name ?? null, daira: r.commune?.daira.name ?? null,
      wilaya: r.commune?.daira.wilaya.name ?? null, wilayaSlug: r.commune?.daira.wilaya.slug ?? null,
      publishedNews: r._count.news, lastLoginAt: r.lastLoginAt, createdAt: r.createdAt,
    }))
    .sort((a, b) => b.publishedNews - a.publishedNews);

  const byNews = [...ranked];
  const byRecent = [...ranked].filter((r) => r.lastLoginAt).sort((a, b) => b.lastLoginAt!.getTime() - a.lastLoginAt!.getTime());
  const byWilaya = [...ranked].reduce((acc, r) => {
    const key = r.wilaya ?? "غير محدد";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {} as Record<string, typeof ranked>);

  return (
    <div>
      <h1 className="text-xl font-bold text-navy mb-6">ترتيب المراسلين</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RankTable title="الأكثر نشراً" rows={byNews.slice(0, 15).map((r) => ({ name: r.name, commune: r.commune, wilaya: r.wilaya, value: r.publishedNews }))} metricLabel="خبر" />

        <RankTable title="الأكثر نشاطاً مؤخراً" rows={byRecent.slice(0, 15).map((r) => ({ name: r.name, commune: r.commune, wilaya: r.wilaya, value: fmtDate(r.lastLoginAt) }))} metricLabel="آخر دخول" />

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <div className="bg-navy text-white px-4 py-2">
              <h2 className="text-xs font-bold">حسب الولاية</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {Object.entries(byWilaya).sort(([a], [b]) => a.localeCompare(b)).map(([wilaya, reps]) => (
                <div key={wilaya} className="border border-gray-200 rounded-sm p-3">
                  <p className="text-xs font-bold text-navy mb-2 flex items-center justify-between">
                    {wilaya}
                    <span className="text-[10px] text-muted-foreground">{reps.length} مراسل</span>
                  </p>
                  {reps.sort((a, b) => b.publishedNews - a.publishedNews).slice(0, 5).map((r, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-4 text-[10px] text-muted-foreground text-center">{i + 1}</span>
                        <span className="text-xs">{r.name}</span>
                      </div>
                      <span className="text-[10px] font-bold">{r.publishedNews} خبر</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type RankRow = { name: string; commune: string | null; wilaya: string | null; value: string | number };

function RankTable({ title, rows, metricLabel }: {
  title: string; rows: RankRow[]; metricLabel: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
      <div className="bg-navy text-white px-4 py-2">
        <h2 className="text-xs font-bold">{title}</h2>
      </div>
      <table className="w-full text-xs">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-right p-2 font-bold text-navy w-8">#</th>
            <th className="text-right p-2 font-bold text-navy">المراسل</th>
            <th className="text-right p-2 font-bold text-navy">المنطقة</th>
            <th className="text-center p-2 font-bold text-navy">{metricLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-2 text-center font-bold text-muted-foreground">{i + 1}</td>
              <td className="p-2">{r.name}</td>
              <td className="p-2 text-muted-foreground">{r.commune && `${r.wilaya} > ${r.commune}`}</td>
              <td className="p-2 text-center font-bold">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function fmtDate(d: Date | null | undefined): string {
  if (!d) return "---";
  return d.toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" });
}
