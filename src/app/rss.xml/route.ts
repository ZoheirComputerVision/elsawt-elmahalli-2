import { prisma } from "@/lib/prisma";

const BASE = "https://school-news-ai-209c.apps.hostingguru.io";
const SITE_NAME = "الصوت المحلي";

export async function GET() {
  const news = await prisma.news.findMany({
    where: { status: "published" },
    select: { slug: true, title: true, summary: true, publishedAt: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${BASE}</link>
    <description>آخر الأخبار والمقالات من ${SITE_NAME}</description>
    <language>ar</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml"/>
    ${news.map((n) => `    <item>
      <title>${escapeXml(n.title)}</title>
      <link>${BASE}/news/${n.slug}</link>
      <guid isPermaLink="true">${BASE}/news/${n.slug}</guid>
      <description>${escapeXml(n.summary ?? n.title)}</description>
            <pubDate>${n.publishedAt?.toUTCString() ?? new Date(0).toUTCString()}</pubDate>
      ${n.summary ? `<media:description>${escapeXml(n.summary)}</media:description>` : ""}
    </item>`).join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
