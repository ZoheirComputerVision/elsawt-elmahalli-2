import { prisma } from "@/lib/prisma";

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
              },
            },
          },
        },
      },
    });

    const recentNews = await prisma.news.groupBy({
      by: ["communeId"],
      _count: true,
      where: {
        status: "published",
        publishedAt: { gte: sevenDaysAgo },
        communeId: { not: null },
      },
    });

    const communesWithoutReporters: { id: string; name: string; daira: string; wilaya: string; dairaId: string }[] = [];
    const communesWithoutNews: { id: string; name: string; daira: string; wilaya: string; dairaId: string }[] = [];
    const lowActivityDairas: { dairaId: string; daira: string; wilaya: string; totalCommunes: number; coveredCommunes: number; recentNews: number }[] = [];

    for (const daira of dairas) {
      let uncoveredCount = 0;
      let dairaRecentNews = 0;

      for (const commune of daira.communes) {
        if (commune._count.reporters === 0) {
          communesWithoutReporters.push({
            id: commune.id, name: commune.name,
            daira: daira.name, wilaya: daira.wilaya.name, dairaId: daira.id,
          });
          uncoveredCount++;
        }
        if (commune._count.news === 0) {
          communesWithoutNews.push({
            id: commune.id, name: commune.name,
            daira: daira.name, wilaya: daira.wilaya.name, dairaId: daira.id,
          });
        }
        const rn = recentNews.find((r) => r.communeId === commune.id);
        dairaRecentNews += rn?._count ?? 0;
      }

      if (uncoveredCount > 0 || dairaRecentNews === 0) {
        lowActivityDairas.push({
          dairaId: daira.id, daira: daira.name, wilaya: daira.wilaya.name,
          totalCommunes: daira.communes.length,
          coveredCommunes: daira.communes.length - uncoveredCount,
          recentNews: dairaRecentNews,
        });
      }
    }

    const uncoveredDairas = dairas
      .filter((d) => d.communes.every((c) => c._count.reporters === 0))
      .map((d) => ({ id: d.id, name: d.name, wilaya: d.wilaya.name }));

    return Response.json({
      success: true,
      data: {
        uncoveredDairas,
        communesWithoutReporters,
        communesWithoutNews,
        lowActivityDairas: lowActivityDairas.sort((a, b) => a.recentNews - b.recentNews),
        summary: {
          totalUncoveredDairas: uncoveredDairas.length,
          totalCommunesWithoutReporters: communesWithoutReporters.length,
          totalCommunesWithoutNews: communesWithoutNews.length,
          totalLowActivityDairas: lowActivityDairas.length,
        },
      },
    });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
