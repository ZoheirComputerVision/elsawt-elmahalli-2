const BASE = "https://school-news-ai-209c.apps.hostingguru.io";

export async function GET() {
  const text = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${BASE}/sitemap.xml
Sitemap: ${BASE}/rss.xml
`;
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
