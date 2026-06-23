import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function fmtDate(d: Date | null | undefined): string {
  if (!d) return "---";
  return d.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
}

export default async function AdminDashboard() {
  const [
    totalNews, publishedCount, draftCount, reviewCount, approvedCount, archivedCount,
    usersCount, reportersCount, activeReportersCount, editorsCount, adminsCount,
    categoriesCount, regionsCount, adsCount, directoryCount,
    wilayasCount, dairasCount, communesCount,
    newsletterCount, contactCount, contactUnread,
    totalAdViews, totalAdClicks,
    lastPublished,
    newsByWilaya,
  ] = await Promise.all([
    prisma.news.count(),
    prisma.news.count({ where: { status: "published" } }),
    prisma.news.count({ where: { status: "draft" } }),
    prisma.news.count({ where: { status: "review" } }),
    prisma.news.count({ where: { status: "approved" } }),
    prisma.news.count({ where: { status: "archived" } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "REPORTER" } }),
    prisma.user.count({ where: { role: "REPORTER", active: true } }),
    prisma.user.count({ where: { role: "EDITOR" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.category.count(),
    prisma.region.count(),
    prisma.ad.count(),
    prisma.directoryEntry.count(),
    prisma.wilaya.count(),
    prisma.daira.count(),
    prisma.commune.count(),
    prisma.newsletterSubscription.count({ where: { active: true } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.ad.aggregate({ _sum: { views: true } }),
    prisma.ad.aggregate({ _sum: { clicks: true } }),
    prisma.news.findFirst({ where: { status: "published" }, orderBy: { publishedAt: "desc" }, select: { publishedAt: true } }),
    prisma.wilaya.findMany({
      select: {
        name: true, slug: true,
        _count: { select: { dairas: true } },
        dairas: {
          select: {
            communes: {
              select: { _count: { select: { news: { where: { status: "published" } }, reporters: { where: { active: true } }, directories: { where: { status: "active" } } } } },
            },
          },
        },
      },
    }),
  ]);

  const totalImpressions = totalAdViews._sum.views ?? 0;
  const totalClicks = totalAdClicks._sum.clicks ?? 0;
  const adsCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground mt-1">آخر نشر: {fmtDate(lastPublished?.publishedAt)}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard label="إجمالي الأخبار" value={totalNews} color="text-navy" />
        <StatCard label="منشور" value={publishedCount} color="text-green-600" />
        <StatCard label="قيد المراجعة" value={reviewCount} color="text-amber-600" />
        <StatCard label="معتمد" value={approvedCount} color="text-blue-600" />
        <StatCard label="مسودة" value={draftCount} color="text-gray-500" />
        <StatCard label="مؤرشف" value={archivedCount} color="text-red-500" />
        <StatCard label="المستخدمون" value={usersCount} color="text-navy" />
        <StatCard label="المراسلون" value={reportersCount} color="text-navy" />
        <StatCard label="مراسلين نشطين" value={activeReportersCount} color="text-green-600" />
        <StatCard label="المحررون" value={editorsCount} color="text-navy" />
        <StatCard label="المديرون" value={adminsCount} color="text-navy" />
        <StatCard label="التصنيفات" value={categoriesCount} color="text-navy" />
        <StatCard label="المناطق" value={regionsCount} color="text-navy" />
        <StatCard label="الإعلانات" value={adsCount} color="text-navy" />
        <StatCard label="الدليل" value={directoryCount} color="text-navy" />
        <StatCard label="الولايات" value={wilayasCount} color="text-purple-600" />
        <StatCard label="الدوائر" value={dairasCount} color="text-purple-600" />
        <StatCard label="البلديات" value={communesCount} color="text-purple-600" />
        <StatCard label="المشتركين" value={newsletterCount} color="text-green-600" />
        <StatCard label="رسائل التواصل" value={contactCount} color="text-amber-600" />
        <StatCard label="غير مقروء" value={contactUnread} color="text-red-500" />
        <StatCard label="مرات العرض" value={totalImpressions} color="text-blue-600" />
        <StatCard label="النقرات" value={totalClicks} color="text-green-600" />
        <StatCard label="CTR" value={`${adsCtr}%`} color="text-gold" />
      </div>

      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <h2 className="text-sm font-bold text-navy mb-4">توزيع التغطية حسب الولاية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {newsByWilaya.map((w) => {
            const wilayaNews = w.dairas.reduce((s, d) => s + d.communes.reduce((s2, c) => s2 + c._count.news, 0), 0);
            const wilayaReporters = w.dairas.reduce((s, d) => s + d.communes.reduce((s2, c) => s2 + c._count.reporters, 0), 0);
            const wilayaDir = w.dairas.reduce((s, d) => s + d.communes.reduce((s2, c) => s2 + c._count.directories, 0), 0);
            return (
              <div key={w.slug} className="border border-gray-200 rounded-sm p-3">
                <p className="text-xs font-bold text-navy">{w.name}</p>
                <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span>{wilayaNews} خبر</span>
                  <span>{wilayaReporters} مراسل</span>
                  <span>{wilayaDir} دليل</span>
                  <span>{w._count.dairas} دوائر</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <span className="text-xs text-muted-foreground block">{label}</span>
      <p className={`text-2xl font-black ${color} mt-1`}>{value}</p>
    </div>
  );
}
