import { prisma } from "@/lib/prisma";

function classify(score: number): string {
  if (score >= 4) return "excellent";
  if (score >= 3) return "good";
  if (score >= 2) return "average";
  return "weak";
}

export async function GET() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

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
        dairaId: daira.id,
        daira: daira.name,
        wilaya: daira.wilaya.name,
        wilayaSlug: daira.wilaya.slug,
        totalCommunes,
        coveredCommunes,
        coveragePct,
        totalNews,
        totalReporters,
        recentNews,
        totalDirectory: totalDir,
        totalAds,
        score,
        classification: classify(score),
      };
    });

    results.sort((a, b) => b.score - a.score);

    return Response.json({
      success: true,
      data: {
        dairas: results,
        summary: {
          excellent: results.filter((r) => r.classification === "excellent").length,
          good: results.filter((r) => r.classification === "good").length,
          average: results.filter((r) => r.classification === "average").length,
          weak: results.filter((r) => r.classification === "weak").length,
          total: results.length,
        },
      },
    });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
