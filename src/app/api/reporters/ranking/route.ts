import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reporters = await prisma.user.findMany({
      where: { role: "REPORTER", active: true },
      select: {
        id: true, name: true, email: true, avatar: true, bio: true,
        specialization: true, phone: true, lastLoginAt: true, createdAt: true,
        commune: { select: { id: true, name: true, slug: true, daira: { select: { name: true, wilaya: { select: { name: true, slug: true } } } } } },
        _count: { select: { news: { where: { status: "published" } } } },
      },
    });

    const sorted = reporters
      .map((r) => ({
        id: r.id, name: r.name, email: r.email, avatar: r.avatar, bio: r.bio,
        specialization: r.specialization, phone: r.phone,
        lastLoginAt: r.lastLoginAt, createdAt: r.createdAt,
        commune: r.commune?.name ?? null,
        daira: r.commune?.daira.name ?? null,
        wilaya: r.commune?.daira.wilaya.name ?? null,
        wilayaSlug: r.commune?.daira.wilaya.slug ?? null,
        publishedNews: r._count.news,
      }))
      .sort((a, b) => b.publishedNews - a.publishedNews);

    return Response.json({
      success: true,
      data: {
        reporters: sorted,
        topByNews: sorted.slice(0, 10),
        topByRecent: sorted
          .filter((r) => r.lastLoginAt)
          .sort((a, b) => (b.lastLoginAt!.getTime()) - (a.lastLoginAt!.getTime()))
          .slice(0, 10),
        summary: {
          total: sorted.length,
          totalPublished: sorted.reduce((s, r) => s + r.publishedNews, 0),
        },
      },
    });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
