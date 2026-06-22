import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const wilaya = await prisma.wilaya.findUnique({ where: { slug } });
  if (!wilaya) return { title: "غير موجود — الصوت المحلي" };
  return { title: `${wilaya.name} — الصوت المحلي`, description: `آخر الأخبار والمعلومات من ولاية ${wilaya.name}` };
}

export default async function WilayaPage({ params }: Props) {
  const { slug } = await params;
  const wilaya = await prisma.wilaya.findUnique({
    where: { slug },
    include: {
      dairas: { include: { communes: true, _count: { select: { communes: true } } } },
    },
  });
  if (!wilaya) notFound();

  const [news, directory, ads, reporters] = await Promise.all([
    prisma.news.findMany({ where: { status: "published", commune: { daira: { wilayaId: wilaya.id } } }, orderBy: { publishedAt: "desc" }, take: 20, include: { category: true, region: true, createdBy: true } }),
    prisma.directoryEntry.findMany({ where: { status: "active", commune: { daira: { wilayaId: wilaya.id } } }, orderBy: { featured: "desc" }, take: 10 }),
    prisma.ad.findMany({ where: { status: "active", commune: { daira: { wilayaId: wilaya.id } } }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.user.findMany({ where: { role: "REPORTER", commune: { daira: { wilayaId: wilaya.id } } }, take: 20 }),
  ]);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="bg-navy text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/" className="text-xs text-gold hover:text-gold-light transition-colors">← العودة إلى الرئيسية</Link>
          <h1 className="text-3xl font-black mt-2">{wilaya.name}</h1>
          <p className="text-white/70 text-sm mt-1">{wilaya.dairas.length} دائرة | {wilaya.dairas.reduce((s, d) => s + d._count.communes, 0)} بلدية</p>
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
                  {item.region && <span className="text-[10px] text-muted-foreground">{item.region.name}</span>}
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
              <h2 className="text-sm font-bold text-navy mb-3">الدوائر</h2>
              <div className="space-y-1">
                {wilaya.dairas.map((d) => (
                  <Link key={d.id} href={`/daira/${d.slug}`} className="block text-xs text-navy hover:text-gold transition-colors py-1 border-b border-gray-100 last:border-0">
                    {d.name} ({d._count.communes})
                  </Link>
                ))}
              </div>
            </div>

            {ads.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-navy mb-3">إعلانات</h2>
                <div className="space-y-2">
                  {ads.map((ad) => (
                    <div key={ad.id} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                      <p className="text-xs font-bold text-navy">{ad.title}</p>
                      {ad.content && <p className="text-[10px] text-muted-foreground mt-1">{ad.content}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reporters.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-navy mb-3">المراسلون</h2>
                <div className="space-y-2">
                  {reporters.map((r) => (
                    <Link key={r.id} href={`/reporters/${r.id}`} className="flex items-center gap-2 text-xs text-navy hover:text-gold transition-colors">
                      <span className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center text-[10px] font-bold">{r.name.charAt(0)}</span>
                      {r.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {directory.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-navy mb-3">الدليل الاقتصادي</h2>
                <div className="space-y-1">
                  {directory.map((e) => (
                    <Link key={e.id} href={`/directory/${e.id}`} className="block text-xs text-navy hover:text-gold transition-colors py-1 border-b border-gray-100 last:border-0">
                      {e.name} <span className="text-muted-foreground">({e.category})</span>
                    </Link>
                  ))}
                </div>
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
