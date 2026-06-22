import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "الدليل الاقتصادي — الصوت المحلي", description: "الدليل الاقتصادي المحلي لولاية تيارت ومنطقة قصر الشلالة" };

export default async function DirectoryPage() {
  const [entries, categories] = await Promise.all([
    prisma.directoryEntry.findMany({ where: { status: "active" }, orderBy: [{ featured: "desc" }, { name: "asc" }], include: { commune: { include: { daira: { include: { wilaya: true } } } } } }),
    prisma.directoryEntry.groupBy({ by: ["category"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
  ]);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black text-navy tracking-tight">الصوت المحلي</Link>
          <Link href="/" className="text-xs text-gold hover:text-navy transition-colors font-semibold">العودة إلى الرئيسية</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-navy mb-2">الدليل الاقتصادي</h1>
        <p className="text-sm text-muted-foreground mb-6">دليل المؤسسات والخدمات المحلية في ولاية تيارت ومنطقة قصر الشلالة</p>

        <div className="flex flex-wrap gap-2 mb-6">
          <Link href="/directory" className="text-xs bg-gold/10 text-gold font-bold px-3 py-1.5 rounded-sm hover:bg-gold/20 transition-colors">الكل</Link>
          {categories.map((cat) => (
            <Link key={cat.category} href={`/directory?category=${encodeURIComponent(cat.category)}`} className="text-xs bg-gray-100 text-navy px-3 py-1.5 rounded-sm hover:bg-gray-200 transition-colors">
              {cat.category} ({cat._count.id})
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <Link key={entry.id} href={`/directory/${entry.id}`} className="block border border-gray-200 rounded-sm p-4 hover:border-gold/50 hover:shadow-sm transition-all group">
              {entry.featured && <span className="text-[10px] bg-gold text-navy font-bold px-2 py-0.5 rounded-sm mb-2 inline-block">مميز</span>}
              <h3 className="text-sm font-bold text-navy group-hover:text-gold transition-colors">{entry.name}</h3>
              <p className="text-[11px] text-gold font-semibold mt-0.5">{entry.category}</p>
              {entry.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{entry.description}</p>}
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-muted-foreground">
                {entry.phone && <span>📞 {entry.phone}</span>}
                {entry.city && <span>📍 {entry.city}</span>}
                {entry.commune && <span>🗺️ {entry.commune.daira.wilaya.name}</span>}
              </div>
            </Link>
          ))}
        </div>

        {entries.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p>لا توجد قيود في الدليل حالياً</p>
          </div>
        )}
      </div>

      <footer className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} الصوت المحلي</p>
        </div>
      </footer>
    </div>
  );
}
