import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const user = await prisma.user.findFirst({ where: { id: slug, role: "REPORTER" } });
  if (!user) return { title: "غير موجود — الصوت المحلي" };
  return { title: `${user.name} — الصوت المحلي`, description: user.bio ?? `الملف الشخصي للمراسل ${user.name}` };
}

export default async function ReporterProfile({ params }: Props) {
  const { slug } = await params;
  const reporter = await prisma.user.findFirst({
    where: { id: slug, role: "REPORTER" },
    include: { commune: { include: { daira: { include: { wilaya: true } } } }, news: { where: { status: "published" }, orderBy: { publishedAt: "desc" }, take: 50, include: { category: true, region: true } } },
  });
  if (!reporter) notFound();

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black text-navy tracking-tight">الصوت المحلي</Link>
          <Link href="/" className="text-xs text-gold hover:text-navy transition-colors font-semibold">العودة إلى الرئيسية</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {reporter.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-navy">{reporter.name}</h1>
            <p className="text-sm text-gold font-semibold">{reporter.specialization ?? "مراسل ميداني"}</p>
            {reporter.commune && (
              <p className="text-xs text-muted-foreground mt-1">
                {reporter.commune.name} — {reporter.commune.daira.name} — {reporter.commune.daira.wilaya.name}
              </p>
            )}
            {reporter.bio && <p className="text-sm text-gray-600 mt-3 max-w-xl leading-relaxed">{reporter.bio}</p>}
            <p className="text-xs text-muted-foreground mt-2">{reporter.news.length} مقال منشور</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-navy mb-4">المقالات المنشورة</h2>
        <div className="space-y-3">
          {reporter.news.map((article) => (
            <Link key={article.id} href={`/news/${article.slug}`} className="block border border-gray-200 rounded-sm p-4 hover:border-gold/50 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-2 mb-1">
                {article.category && <span className="text-[10px] text-gold font-semibold">{article.category.name}</span>}
                {article.region && <span className="text-[10px] text-muted-foreground">{article.region.name}</span>}
              </div>
              <h3 className="text-sm font-bold text-navy group-hover:text-gold transition-colors">{article.title}</h3>
              {article.summary && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.summary}</p>}
              <span className="text-[10px] text-muted-foreground mt-2 block">
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }) : ""}
              </span>
            </Link>
          ))}
          {reporter.news.length === 0 && <p className="text-sm text-muted-foreground">لا توجد مقالات منشورة بعد</p>}
        </div>
      </div>

      <footer className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} الصوت المحلي</p>
        </div>
      </footer>
    </div>
  );
}
