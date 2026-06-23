import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المراسلون — الصوت المحلي",
  description: "فريق المراسلين الميدانيين في الصوت المحلي",
};

export default async function ReportersListPage() {
  const reporters = await prisma.user.findMany({
    where: { role: "REPORTER", active: true },
    include: {
      commune: { include: { daira: { include: { wilaya: true } } } },
      _count: { select: { news: { where: { status: "published" } } } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="bg-navy text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link href="/" className="text-xs text-gold hover:text-gold-light transition-colors">← العودة إلى الرئيسية</Link>
          <h1 className="text-3xl font-black mt-2">المراسلون</h1>
          <p className="text-white/70 text-sm mt-1">{reporters.length} مراسل ميداني</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {reporters.length === 0 && (
          <p className="text-center py-12 text-sm text-muted-foreground">لا يوجد مراسلون بعد</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reporters.map((reporter) => (
            <Link
              key={reporter.id}
              href={`/reporters/${reporter.id}`}
              className="block border border-gray-200 rounded-sm p-4 hover:border-gold/50 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-white text-lg font-bold shrink-0">
                  {reporter.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-navy group-hover:text-gold transition-colors truncate">{reporter.name}</h2>
                  <p className="text-[10px] text-gold font-semibold">{reporter.specialization ?? "مراسل ميداني"}</p>
                </div>
              </div>

              {reporter.bio && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{reporter.bio}</p>
              )}

              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{reporter.commune ? `${reporter.commune.name}، ${reporter.commune.daira.wilaya.name}` : "منطقة غير محددة"}</span>
                <span className="font-semibold text-navy">{reporter._count.news} مقال</span>
              </div>
            </Link>
          ))}
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
