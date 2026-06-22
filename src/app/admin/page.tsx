import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function fmtDate(d: Date | null | undefined): string {
  if (!d) return "---";
  return d.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
}

async function getNewsPerDay() {
  const news = await prisma.news.findMany({
    select: { createdAt: true, status: true },
    orderBy: { createdAt: "desc" },
  });

  const map = new Map<string, number>();
  for (const item of news) {
    const day = item.createdAt.toISOString().slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + 1);
  }

  const entries = Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14);

  const maxVal = Math.max(...entries.map(([, v]) => v), 1);
  return { entries, maxVal };
}

async function getNewsPerCategory() {
  const data = await prisma.news.groupBy({
    by: ["categoryId"],
    _count: { id: true },
  });
  const categories = await prisma.category.findMany();
  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  const entries = data
    .map((d) => ({ name: catMap.get(d.categoryId) ?? "غير معروف", count: d._count.id }))
    .sort((a, b) => b.count - a.count);

  const maxVal = Math.max(...entries.map((e) => e.count), 1);
  return { entries, maxVal };
}

async function getNewsPerRegion() {
  const data = await prisma.news.groupBy({
    by: ["regionId"],
    _count: { id: true },
  });
  const regions = await prisma.region.findMany();
  const regMap = new Map(regions.map((r) => [r.id, r.name]));

  const entries = data
    .filter((d) => d.regionId)
    .map((d) => ({ name: regMap.get(d.regionId!) ?? "غير معروف", count: d._count.id }))
    .sort((a, b) => b.count - a.count);

  const totalOthers = data
    .filter((d) => !d.regionId)
    .reduce((s, d) => s + d._count.id, 0);

  const maxVal = Math.max(...entries.map((e) => e.count), 1);
  return { entries, maxVal, totalOthers };
}

export default async function AdminDashboard() {
  const [
    totalNews,
    publishedCount,
    draftCount,
    reviewCount,
    approvedCount,
    archivedCount,
    usersCount,
    reportersCount,
    categoriesCount,
    regionsCount,
    adsCount,
    directoryCount,
    wilayasCount,
    dairasCount,
    communesCount,
    lastPublished,
    perDay,
    perCategory,
    perRegion,
  ] = await Promise.all([
    prisma.news.count(),
    prisma.news.count({ where: { status: "published" } }),
    prisma.news.count({ where: { status: "draft" } }),
    prisma.news.count({ where: { status: "review" } }),
    prisma.news.count({ where: { status: "approved" } }),
    prisma.news.count({ where: { status: "archived" } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "REPORTER" } }),
    prisma.category.count(),
    prisma.region.count(),
    prisma.ad.count(),
    prisma.directoryEntry.count(),
    prisma.wilaya.count(),
    prisma.daira.count(),
    prisma.commune.count(),
    prisma.news.findFirst({ where: { status: "published" }, orderBy: { publishedAt: "desc" }, select: { publishedAt: true } }),
    getNewsPerDay(),
    getNewsPerCategory(),
    getNewsPerRegion(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground mt-1">آخر نشر: {fmtDate(lastPublished?.publishedAt)}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard label="إجمالي الأخبار" value={totalNews} color="text-navy" />
        <StatCard label="منشور" value={publishedCount} color="text-green-600" />
        <StatCard label="قيد المراجعة" value={reviewCount} color="text-amber-600" />
        <StatCard label="معتمد" value={approvedCount} color="text-blue-600" />
        <StatCard label="مسودة" value={draftCount} color="text-gray-500" />
        <StatCard label="مؤرشف" value={archivedCount} color="text-red-500" />
        <StatCard label="المستخدمون" value={usersCount} color="text-navy" />
        <StatCard label="المراسلون" value={reportersCount} color="text-navy" />
        <StatCard label="التصنيفات" value={categoriesCount} color="text-navy" />
        <StatCard label="المناطق" value={regionsCount} color="text-navy" />
        <StatCard label="الإعلانات" value={adsCount} color="text-navy" />
        <StatCard label="الدليل" value={directoryCount} color="text-navy" />
        <StatCard label="الولايات" value={wilayasCount} color="text-purple-600" />
        <StatCard label="الدوائر" value={dairasCount} color="text-purple-600" />
        <StatCard label="البلديات" value={communesCount} color="text-purple-600" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News per day */}
        <ChartCard title="الأخبار لكل يوم (آخر 14 يوم)">
          <div className="flex items-end gap-1.5 h-32">
            {perDay.entries.map(([day, count]) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground">{count}</span>
                <div
                  className="w-full bg-gold rounded-sm transition-all hover:opacity-80"
                  style={{ height: `${(count / perDay.maxVal) * 100}%`, minHeight: count > 0 ? "4px" : "0" }}
                />
                <span className="text-[8px] text-muted-foreground rotate-45 origin-left whitespace-nowrap">
                  {day.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* News per category */}
        <ChartCard title="الأخبار لكل تصنيف">
          <div className="space-y-2">
            {perCategory.entries.map(({ name, count }) => (
              <div key={name} className="flex items-center gap-2">
                <span className="text-xs text-navy w-20 truncate shrink-0">{name}</span>
                <div className="flex-1 bg-gray-100 rounded-sm h-5 overflow-hidden">
                  <div
                    className="bg-navy h-full rounded-sm transition-all"
                    style={{ width: `${(count / perCategory.maxVal) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-left shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News per region */}
        <ChartCard title="الأخبار لكل منطقة">
          <div className="space-y-2">
            {perRegion.entries.map(({ name, count }) => (
              <div key={name} className="flex items-center gap-2">
                <span className="text-xs text-navy w-24 truncate shrink-0">{name}</span>
                <div className="flex-1 bg-gray-100 rounded-sm h-5 overflow-hidden">
                  <div
                    className="bg-gold h-full rounded-sm transition-all"
                    style={{ width: `${(count / perRegion.maxVal) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-left shrink-0">{count}</span>
              </div>
            ))}
            {perRegion.totalOthers > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-24 truncate shrink-0">بدون منطقة</span>
                <div className="flex-1 bg-gray-100 rounded-sm h-5 overflow-hidden">
                  <div className="bg-gray-300 h-full rounded-sm" style={{ width: `${(perRegion.totalOthers / perRegion.maxVal) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-left shrink-0">{perRegion.totalOthers}</span>
              </div>
            )}
          </div>
        </ChartCard>

        {/* Editorial pipeline */}
        <ChartCard title="خط الإنتاج التحريري">
          <div className="flex items-end gap-2 h-40">
            <PipelineBar label="مسودة" count={draftCount} color="bg-gray-400" max={Math.max(totalNews, 1)} />
            <PipelineBar label="مراجعة" count={reviewCount} color="bg-amber-400" max={Math.max(totalNews, 1)} />
            <PipelineBar label="معتمد" count={approvedCount} color="bg-blue-400" max={Math.max(totalNews, 1)} />
            <PipelineBar label="منشور" count={publishedCount} color="bg-green-500" max={Math.max(totalNews, 1)} />
            <PipelineBar label="مؤرشف" count={archivedCount} color="bg-red-400" max={Math.max(totalNews, 1)} />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <span className="text-xs text-muted-foreground block">{label}</span>
      <p className={`text-2xl font-black ${color} mt-1`}>{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-bold text-navy mb-4">{title}</h3>
      {children}
    </div>
  );
}

function PipelineBar({ label, count, color, max }: { label: string; count: number; color: string; max: number }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <span className="text-xs font-bold text-navy">{count}</span>
      <div className="w-full bg-gray-100 rounded-sm flex-1 flex flex-col justify-end" style={{ height: "100%" }}>
        <div className={`${color} rounded-sm transition-all`} style={{ height: `${(count / max) * 100}%` }} />
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}
