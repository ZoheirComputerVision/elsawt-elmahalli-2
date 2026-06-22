import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const daira = await prisma.daira.findFirst({ where: { slug }, include: { wilaya: true } });
  if (!daira) return { title: "غير موجود — الصوت المحلي" };
  return { title: `${daira.name} — ${daira.wilaya.name} — الصوت المحلي`, description: `آخر الأخبار من دائرة ${daira.name} بولاية ${daira.wilaya.name}` };
}

export default async function DairaPage({ params }: Props) {
  const { slug } = await params;
  const daira = await prisma.daira.findFirst({
    where: { slug },
    include: { wilaya: true, communes: true },
  });
  if (!daira) notFound();

  const [news, directory] = await Promise.all([
    prisma.news.findMany({ where: { status: "published", commune: { dairaId: daira.id } }, orderBy: { publishedAt: "desc" }, take: 20, include: { category: true, createdBy: true } }),
    prisma.directoryEntry.findMany({ where: { status: "active", commune: { dairaId: daira.id } }, orderBy: { featured: "desc" }, take: 10 }),
  ]);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="bg-navy text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href={`/wilaya/${daira.wilaya.slug}`} className="text-xs text-gold hover:text-gold-light transition-colors">← {daira.wilaya.name}</Link>
          <h1 className="text-3xl font-black mt-2">دائرة {daira.name}</h1>
          <p className="text-white/70 text-sm mt-1">{daira.communes.length} بلدية</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-navy">آخر الأخبار</h2>
            {news.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`} className="block border border-gray-200 rounded-sm p-4 hover:border-gold/50 transition-all group">
                <div className="flex items-center gap-2 mb-1">
                  {item.category && <span className="text-[10px] text-gold font-semibold">{item.category.name}</span>}
                </div>
                <h3 className="text-sm font-bold text-navy group-hover:text-gold transition-colors">{item.title}</h3>
                {item.summary && <p className="text-xs text-gray-500 mt-1">{item.summary}</p>}
                {item.createdBy && <p className="text-[10px] text-muted-foreground mt-1">بقلم: {item.createdBy.name}</p>}
              </Link>
            ))}
            {news.length === 0 && <p className="text-sm text-muted-foreground">لا توجد أخبار بعد</p>}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-bold text-navy mb-3">البلديات</h2>
              <div className="space-y-1">
                {daira.communes.map((c) => (
                  <Link key={c.id} href={`/commune/${c.slug}`} className="block text-xs text-navy hover:text-gold transition-colors py-1 border-b border-gray-100 last:border-0">{c.name}</Link>
                ))}
              </div>
            </div>

            {directory.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-navy mb-3">الدليل الاقتصادي</h2>
                {directory.map((e) => (
                  <Link key={e.id} href={`/directory/${e.id}`} className="block text-xs text-navy hover:text-gold transition-colors py-1 border-b border-gray-100 last:border-0">
                    {e.name} <span className="text-muted-foreground">({e.category})</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} الصوت المحلي</p>
        </div>
      </footer>
    </div>
  );
}
