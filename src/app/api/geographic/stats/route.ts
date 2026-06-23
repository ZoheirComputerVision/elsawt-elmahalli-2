import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [wilayas, dairas, communes, reporters, newsByWilaya, reportersByWilaya, directoryByWilaya, adsByWilaya] = await Promise.all([
      prisma.wilaya.count(),
      prisma.daira.count(),
      prisma.commune.count(),
      prisma.user.count({ where: { role: "REPORTER", active: true } }),
      prisma.news.groupBy({ by: ["communeId"], _count: true, where: { status: "published" } }),
      prisma.user.groupBy({ by: ["communeId"], _count: true, where: { role: "REPORTER", active: true } }),
      prisma.directoryEntry.groupBy({ by: ["communeId"], _count: true, where: { status: "active" } }),
      prisma.ad.groupBy({ by: ["communeId"], _count: true, where: { status: "active" } }),
    ]);

    const communesWithData = await prisma.commune.findMany({
      select: {
        id: true, name: true, slug: true,
        daira: { select: { id: true, name: true, slug: true, wilaya: { select: { id: true, name: true, slug: true } } } },
      },
    });

    const coverage = communesWithData.map((c) => {
      const newsCount = newsByWilaya.find((n) => n.communeId === c.id)?._count ?? 0;
      const reporterCount = reportersByWilaya.find((r) => r.communeId === c.id)?._count ?? 0;
      const directoryCount = directoryByWilaya.find((d) => d.communeId === c.id)?._count ?? 0;
      const adsCount = adsByWilaya.find((a) => a.communeId === c.id)?._count ?? 0;
      return {
        wilaya: c.daira.wilaya.name,
        daira: c.daira.name,
        commune: c.name,
        newsCount,
        reporterCount,
        directoryCount,
        adsCount,
      };
    });

    return Response.json({
      success: true,
      data: {
        totals: { wilayas, dairas, communes, reporters, coverage },
        perWilaya: aggregateByWilaya(coverage),
        perDaira: aggregateByDaira(coverage),
      },
    });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

function aggregateByWilaya(coverage: { wilaya: string; daira: string; newsCount: number; reporterCount: number; directoryCount: number; adsCount: number }[]) {
  const map = new Map<string, { newsCount: number; reporterCount: number; directoryCount: number; adsCount: number; dairaCount: number }>();
  for (const c of coverage) {
    const existing = map.get(c.wilaya) ?? { newsCount: 0, reporterCount: 0, directoryCount: 0, adsCount: 0, dairaCount: 0 };
    existing.newsCount += c.newsCount;
    existing.reporterCount += c.reporterCount;
    existing.directoryCount += c.directoryCount;
    existing.adsCount += c.adsCount;
    existing.dairaCount += 1;
    map.set(c.wilaya, existing);
  }
  return Array.from(map.entries()).map(([name, stats]) => ({ name, ...stats }));
}

function aggregateByDaira(coverage: { wilaya: string; daira: string; newsCount: number; reporterCount: number; directoryCount: number; adsCount: number }[]) {
  const map = new Map<string, { wilaya: string; newsCount: number; reporterCount: number; directoryCount: number; adsCount: number }>();
  for (const c of coverage) {
    const key = `${c.wilaya} > ${c.daira}`;
    const existing = map.get(key) ?? { wilaya: c.wilaya, newsCount: 0, reporterCount: 0, directoryCount: 0, adsCount: 0 };
    existing.newsCount += c.newsCount;
    existing.reporterCount += c.reporterCount;
    existing.directoryCount += c.directoryCount;
    existing.adsCount += c.adsCount;
    map.set(key, existing);
  }
  return Array.from(map.entries()).map(([name, stats]) => ({ name, ...stats }));
}
