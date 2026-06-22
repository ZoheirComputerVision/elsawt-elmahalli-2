import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { newsService } from "@/features/news/services";
import Link from "next/link";
import ShareButtons from "@/components/news/ShareButtons";
import CopyLinkButton from "@/components/news/CopyLinkButton";
import PrintButton from "@/components/news/PrintButton";
import NewsletterSubscribe from "@/components/news/NewsletterSubscribe";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await newsService.getBySlug(slug);
  if (!news) return { title: "الخبر غير موجود — الصوت المحلي" };

  return {
    title: `${news.title} — الصوت المحلي`,
    description: news.summary ?? undefined,
    openGraph: {
      title: news.title,
      description: news.summary ?? undefined,
      type: "article",
      publishedTime: news.publishedAt ?? undefined,
      locale: "ar_AR",
    },
  };
}

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function readingTime(body: string | null | undefined): number {
  if (!body) return 1;
  return Math.max(1, Math.ceil(body.split(/\s+/).length / 200));
}

async function getRelatedNews(categoryId: string, excludeSlug: string, limit = 4) {
  return prisma.news.findMany({
    where: { categoryId, status: "published", slug: { not: excludeSlug } },
    include: { category: true, region: true, media: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

async function getWilayaDairaCommune(news: { communeId?: string | null; regionId?: string | null }) {
  if (!news.communeId) return null;
  const commune = await prisma.commune.findUnique({
    where: { id: news.communeId },
    include: { daira: { include: { wilaya: true } } },
  });
  return commune;
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const news = await newsService.getBySlug(slug);
  if (!news) notFound();

  await prisma.news.update({ where: { id: news.id }, data: { viewCount: { increment: 1 } } });

  const related = news.category ? await getRelatedNews(news.category.id, slug) : [];
  const geo = await getWilayaDairaCommune(news);
  const shareUrl = `https://school-news-ai-209c.apps.hostingguru.io/news/${news.slug}`;

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black text-navy tracking-tight">الصوت المحلي</Link>
          <Link href="/" className="text-xs text-gold hover:text-navy transition-colors font-semibold">العودة إلى الرئيسية</Link>
        </div>
      </header>

      <nav className="max-w-4xl mx-auto px-4 py-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link>
        <span className="mx-2">/</span>
        {news.category && (
          <>
            <Link href={`/news`} className="hover:text-gold transition-colors">{news.category.name}</Link>
            <span className="mx-2">/</span>
          </>
        )}
        {geo && (
          <>
            <Link href={`/wilaya/${geo.daira.wilaya.slug}`} className="hover:text-gold transition-colors">{geo.daira.wilaya.name}</Link>
            <span className="mx-2">/</span>
            <Link href={`/daira/${geo.daira.slug}`} className="hover:text-gold transition-colors">{geo.daira.name}</Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="text-gray-500">{news.title.slice(0, 40)}...</span>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {news.category && <span className="bg-gold/10 text-gold text-xs font-bold px-2.5 py-1 rounded-sm">{news.category.name}</span>}
          {news.region && <span className="bg-navy/5 text-navy text-xs font-medium px-2.5 py-1 rounded-sm">{news.region.name}</span>}
          <span className="text-xs text-muted-foreground">{formatDate(news.publishedAt)}</span>
          <span className="text-xs text-muted-foreground">{readingTime(news.body)} دقيقة قراءة</span>
          <span className="text-xs text-muted-foreground">{news.viewCount.toLocaleString()} مشاهدة</span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-navy leading-tight mb-4">{news.title}</h1>
        {news.summary && <p className="text-lg text-gray-600 leading-relaxed mb-6">{news.summary}</p>}

        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm flex items-center justify-center text-gray-300 mb-8">
          <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {news.createdBy && (
          <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-sm border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white text-sm font-bold shrink-0">
              {news.createdBy.name.charAt(0)}
            </div>
            <div>
              <Link href={`/reporters/${news.createdBy.id}`} className="text-sm font-bold text-navy hover:text-gold transition-colors">
                {news.createdBy.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {news.createdBy.specialization ?? "مراسل"} 
                {news.createdBy.bio && ` — ${news.createdBy.bio.slice(0, 60)}...`}
              </p>
            </div>
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-8">
          {news.body ? (
            news.body.split("\n").map((p, i) => (
              <p key={i} className="text-base leading-8 text-gray-800 mb-4">{p}</p>
            ))
          ) : (
            <p className="text-gray-400 italic">لا يوجد محتوى مكتوب لهذا الخبر</p>
          )}
        </div>

        <div className="flex items-center justify-between py-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <ShareButtons url={shareUrl} title={news.title} />
            <CopyLinkButton url={shareUrl} />
          </div>
          <PrintButton />
        </div>
      </article>

      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <NewsletterSubscribe />
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-lg font-bold text-navy mb-5">أخبار ذات صلة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="bg-white border border-gray-200 rounded-sm p-4 hover:border-gold/50 hover:shadow-sm transition-all group">
                  <span className="text-[10px] text-gold font-semibold">{item.category?.name ?? ""}</span>
                  <h3 className="text-sm font-bold text-navy leading-snug mt-1 group-hover:text-gold transition-colors line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.summary}</p>
                  <span className="text-[10px] text-muted-foreground mt-2 block">{item.publishedAt ? formatDate(item.publishedAt.toISOString()) : ""}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} الصوت المحلي — جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
