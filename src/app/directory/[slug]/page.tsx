import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await prisma.directoryEntry.findUnique({ where: { id: slug } });
  if (!entry) return { title: "غير موجود — الصوت المحلي" };
  return { title: `${entry.name} — الدليل الاقتصادي — الصوت المحلي`, description: entry.description ?? undefined };
}

export default async function DirectoryItemPage({ params }: Props) {
  const { slug } = await params;
  const entry = await prisma.directoryEntry.findUnique({
    where: { id: slug },
    include: { commune: { include: { daira: { include: { wilaya: true } } } } },
  });
  if (!entry) notFound();

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-black text-navy tracking-tight">الصوت المحلي</Link>
          <Link href="/directory" className="text-xs text-gold hover:text-navy transition-colors font-semibold">الدليل الاقتصادي</Link>
        </div>
      </header>

      <nav className="max-w-4xl mx-auto px-4 py-3 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link>
        <span className="mx-2">/</span>
        <Link href="/directory" className="hover:text-gold transition-colors">الدليل الاقتصادي</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-500">{entry.name}</span>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-start gap-4 mb-6">
          {entry.imageUrl && <img src={entry.imageUrl} alt={entry.name} className="w-24 h-24 object-cover rounded-sm" />}
          <div>
            <h1 className="text-2xl font-black text-navy">{entry.name}</h1>
            <p className="text-sm text-gold font-semibold mt-1">{entry.category}</p>
            {entry.featured && <span className="text-[10px] bg-gold text-navy font-bold px-2 py-0.5 rounded-sm mt-1 inline-block">مميز</span>}
          </div>
        </div>

        {entry.description && <p className="text-sm text-gray-600 leading-relaxed mb-6">{entry.description}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {entry.phone && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">هاتف:</span>
              <a href={`tel:${entry.phone}`} className="text-navy hover:text-gold transition-colors font-bold" dir="ltr">{entry.phone}</a>
            </div>
          )}
          {entry.email && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">بريد:</span>
              <a href={`mailto:${entry.email}`} className="text-navy hover:text-gold transition-colors">{entry.email}</a>
            </div>
          )}
          {entry.website && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">موقع:</span>
              <a href={entry.website} target="_blank" rel="noopener noreferrer" className="text-navy hover:text-gold transition-colors">{entry.website}</a>
            </div>
          )}
          {entry.address && <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">العنوان:</span><span>{entry.address}</span></div>}
          {entry.city && <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">المدينة:</span><span>{entry.city}</span></div>}
          {entry.province && <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">الولاية:</span><span>{entry.province}</span></div>}
          {entry.contactName && <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">جهة الاتصال:</span><span>{entry.contactName}</span></div>}
        </div>

        {entry.commune && (
          <div className="text-xs text-muted-foreground border-t border-gray-200 pt-4">
            الموقع: {entry.commune.name}، {entry.commune.daira.name}، {entry.commune.daira.wilaya.name}
          </div>
        )}
      </div>

      <footer className="border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} الصوت المحلي</p>
        </div>
      </footer>
    </div>
  );
}
