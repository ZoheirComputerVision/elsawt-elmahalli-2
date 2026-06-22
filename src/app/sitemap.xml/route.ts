import { prisma } from "@/lib/prisma";

const BASE_URL = "https://school-news-ai-209c.apps.hostingguru.io";

export async function GET() {
  const news = await prisma.news.findMany({
    where: { status: "published" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  const urls: Array<{ loc: string; priority: string; changefreq: string; lastmod?: string }> = [
    { loc: BASE_URL, priority: "1.0", changefreq: "daily" },
    { loc: `${BASE_URL}/search`, priority: "0.6", changefreq: "weekly" },
    ...news.map((n) => ({
      loc: `${BASE_URL}/news/${n.slug}`,
      lastmod: n.updatedAt.toISOString(),
      priority: "0.9",
      changefreq: "weekly" as const,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
