import { prisma } from "@/lib/prisma";
import { getSevenDaysAgo } from "@/lib/date-utils";

export const dynamic = "force-dynamic";

function classify(score: number): string {
  if (score >= 4) return "excellent";
  if (score >= 3) return "good";
  if (score >= 2) return "average";
  return "weak";
}

const badges: Record<string, { label: string; color: string }> = {
  excellent: { label: "ممتاز", color: "bg-green-100 text-green-800 border-green-300" },
  good: { label: "جيد", color: "bg-blue-100 text-blue-800 border-blue-300" },
  average: { label: "متوسط", color: "bg-amber-100 text-amber-800 border-amber-300" },
  weak: { label: "ضعيف", color: "bg-red-100 text-red-800 border-red-300" },
};

export default async function CoverageScorePage() {
  const sevenDaysAgo = getSevenDaysAgo();

  const dairas = await prisma.daira.findMany({
    include: {
      wilaya: { select: { id: true, name: true, slug: true } },
      communes: {
        include: {
          _count: {
            select: {
              news: { where: { status: "published" } },
              reporters: { where: { active: true } },
              directories: { where: { status: "active" } },
              ads: { where: { status: "active" } },
            },
          },
        },
      },
    },
  });

  const recentNewsCounts = await prisma.news.groupBy({
    by: ["communeId"],
    _count: true,
    where: {
      status: "published",
      publishedAt: { gte: sevenDaysAgo },
      communeId: { not: null },
    },
  });

  const results = dairas.map((daira) => {
    const totalCommunes = daira.communes.length;
    const totalNews = daira.communes.reduce((s, c) => s + c._count.news, 0);
    const totalReporters = daira.communes.reduce((s, c) => s + c._count.reporters, 0);
    const totalDir = daira.communes.reduce((s, c) => s + c._count.directories, 0);
    const totalAds = daira.communes.reduce((s, c) => s + c._count.ads, 0);

    const recentNews = daira.communes.reduce((s, c) => {
      const found = recentNewsCounts.find((r) => r.communeId === c.id);
      return s + (found?._count ?? 0);
    }, 0);

    const coveredCommunes = daira.communes.filter((c) => c._count.reporters > 0).length;
    const coveragePct = totalCommunes > 0 ? Math.round((coveredCommunes / totalCommunes) * 100) : 0;

    let score = 0;
    if (totalNews >= 10) score += 2;
    else if (totalNews >= 5) score += 1;
    if (totalReporters >= 3) score += 2;
    else if (totalReporters >= 1) score += 1;
    if (recentNews >= 3) score += 2;
    else if (recentNews >= 1) score += 1;
    if (totalDir + totalAds >= 5) score += 2;
    else if (totalDir + totalAds >= 1) score += 1;
    if (coveragePct >= 75) score += 2;
    else if (coveragePct >= 25) score += 1;

    return {
      daira: daira.name,
      wilaya: daira.wilaya.name,
      totalCommunes,
      coveredCommunes,
      coveragePct,
      totalNews,
      totalReporters,
      recentNews,
      totalDir,
      totalAds,
      score,
      classification: classify(score),
    };
  });

  results.sort((a, b) => b.score - a.score);

  const summary = {
    excellent: results.filter((r) => r.classification === "excellent").length,
    good: results.filter((r) => r.classification === "good").length,
    average: results.filter((r) => r.classification === "average").length,
    weak: results.filter((r) => r.classification === "weak").length,
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-navy mb-6">مؤشر التغطية</h1>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {(["excellent", "good", "average", "weak"] as const).map((key) => (
          <div key={key} className={`border rounded-sm p-3 text-center ${badges[key].color}`}>
            <p className="text-2xl font-black">{summary[key]}</p>
            <p className="text-[10px]">{badges[key].label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-right p-3 font-bold text-navy">الدائرة</th>
              <th className="text-right p-3 font-bold text-navy">الولاية</th>
              <th className="text-center p-3 font-bold text-navy">البلدان</th>
              <th className="text-center p-3 font-bold text-navy">تغطية</th>
              <th className="text-center p-3 font-bold text-navy">أخبار</th>
              <th className="text-center p-3 font-bold text-navy">مراسلين</th>
              <th className="text-center p-3 font-bold text-navy">آخر 7 أيام</th>
              <th className="text-center p-3 font-bold text-navy">دليل</th>
              <th className="text-center p-3 font-bold text-navy">إعلانات</th>
              <th className="text-center p-3 font-bold text-navy">النقاط</th>
              <th className="text-center p-3 font-bold text-navy">التقييم</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3 font-semibold">{r.daira}</td>
                <td className="p-3 text-muted-foreground">{r.wilaya}</td>
                <td className="text-center p-3">{r.totalCommunes}</td>
                <td className="text-center p-3">{r.coveragePct}%</td>
                <td className="text-center p-3">{r.totalNews}</td>
                <td className="text-center p-3">{r.totalReporters}</td>
                <td className="text-center p-3">{r.recentNews}</td>
                <td className="text-center p-3">{r.totalDir}</td>
                <td className="text-center p-3">{r.totalAds}</td>
                <td className="text-center p-3 font-bold text-lg">{r.score}</td>
                <td className="text-center p-3">
                  <span className={`px-2 py-1 rounded-sm text-[10px] font-bold border ${badges[r.classification].color}`}>
                    {badges[r.classification].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
