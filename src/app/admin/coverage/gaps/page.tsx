import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CoverageGapsPage() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const dairas = await prisma.daira.findMany({
    include: {
      wilaya: { select: { id: true, name: true, slug: true } },
      communes: {
        include: {
          _count: {
            select: {
              news: { where: { status: "published" } },
              reporters: { where: { active: true } },
            },
          },
        },
      },
    },
  });

  const recentNews = await prisma.news.groupBy({
    by: ["communeId"],
    _count: true,
    where: { status: "published", publishedAt: { gte: sevenDaysAgo }, communeId: { not: null } },
  });

  const uncoveredDairas = dairas.filter((d) => d.communes.every((c) => c._count.reporters === 0));
  const communesWithoutReporters: { name: string; daira: string; wilaya: string }[] = [];
  const communesWithoutNews: { name: string; daira: string; wilaya: string }[] = [];
  const lowActivityDairas: { daira: string; wilaya: string; totalCommunes: number; coveredCommunes: number }[] = [];

  for (const daira of dairas) {
    let uncoveredCount = 0;
    let dairaRecent = 0;
    for (const commune of daira.communes) {
      if (commune._count.reporters === 0) {
        communesWithoutReporters.push({ name: commune.name, daira: daira.name, wilaya: daira.wilaya.name });
        uncoveredCount++;
      }
      if (commune._count.news === 0) {
        communesWithoutNews.push({ name: commune.name, daira: daira.name, wilaya: daira.wilaya.name });
      }
      const rn = recentNews.find((r) => r.communeId === commune.id);
      dairaRecent += rn?._count ?? 0;
    }
    if (uncoveredCount > 0 || dairaRecent === 0) {
      lowActivityDairas.push({ daira: daira.name, wilaya: daira.wilaya.name, totalCommunes: daira.communes.length, coveredCommunes: daira.communes.length - uncoveredCount });
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-navy mb-6">ثغرات التغطية</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <GapCard label="دوائر غير مغطاة" value={uncoveredDairas.length} color="text-red-500" desc="لا يوجد مراسلين" />
        <GapCard label="بلديات بلا مراسلين" value={communesWithoutReporters.length} color="text-amber-600" desc="تحتاج مراسلين" />
        <GapCard label="بلديات بلا أخبار" value={communesWithoutNews.length} color="text-orange-500" desc="لم تنشر أي خبر" />
        <GapCard label="دوائر منخفضة النشاط" value={lowActivityDairas.length} color="text-purple-600" desc="نشاط ضعيف" />
      </div>

      {uncoveredDairas.length > 0 && (
        <Section title="دوائر غير مغطاة بالكامل" count={uncoveredDairas.length}>
          {uncoveredDairas.map((d) => (
            <Item key={d.id} name={d.name} parent={d.wilaya.name} color="text-red-500" />
          ))}
        </Section>
      )}

      <Section title="بلديات بلا مراسلين" count={communesWithoutReporters.length}>
        {communesWithoutReporters.map((c, i) => (
          <Item key={i} name={c.name} parent={`${c.wilaya} > ${c.daira}`} color="text-amber-600" />
        ))}
      </Section>

      <Section title="بلديات بلا أخبار منشورة" count={communesWithoutNews.length}>
        {communesWithoutNews.slice(0, 50).map((c, i) => (
          <Item key={i} name={c.name} parent={`${c.wilaya} > ${c.daira}`} color="text-orange-500" />
        ))}
      </Section>

      <Section title="دوائر منخفضة النشاط" count={lowActivityDairas.length}>
        {lowActivityDairas.map((d, i) => (
          <Item key={i} name={d.daira} parent={`${d.wilaya} — ${d.coveredCommunes}/${d.totalCommunes} بلديات مغطاة`} color="text-purple-600" />
        ))}
      </Section>
    </div>
  );
}

function GapCard({ label, value, color, desc }: { label: string; value: number; color: string; desc: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-4">
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-xs font-bold text-navy mt-1">{label}</p>
      <p className="text-[10px] text-muted-foreground">{desc}</p>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm mb-4">
      <div className="bg-navy text-white px-4 py-2 flex items-center justify-between">
        <h2 className="text-xs font-bold">{title}</h2>
        <span className="text-[10px] text-gold">{count}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-3">
        {children}
      </div>
    </div>
  );
}

function Item({ name, parent, color }: { name: string; parent: string; color: string }) {
  return (
    <div className="border border-gray-100 rounded-sm p-2 text-center">
      <p className={`text-xs font-bold ${color}`}>{name}</p>
      <p className="text-[9px] text-muted-foreground truncate">{parent}</p>
    </div>
  );
}
