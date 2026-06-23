import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const [
    publishedCount, reviewCount, draftCount, rejectedCount, archivedCount,
    aiDecisionsCount, pendingReview,
    latestAiDecisions,
  ] = await Promise.all([
    prisma.news.count({ where: { status: "published" } }),
    prisma.news.count({ where: { status: "review" } }),
    prisma.news.count({ where: { status: "draft" } }),
    prisma.news.count({ where: { status: { in: ["rejected"] } } }),
    prisma.news.count({ where: { status: "archived" } }),
    prisma.auditLog.count({ where: { action: { startsWith: "AI_" } } }),
    prisma.news.findMany({
      where: { status: "review" },
      include: {
        category: { select: { name: true } },
        region: { select: { name: true } },
        createdBy: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
    prisma.auditLog.findMany({
      where: { action: { startsWith: "AI_" } },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const fmtDate = (d: Date | null | undefined) =>
    d ? d.toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" }) : "—";

  return (
    <div className="space-y-6">
      {/* Header stats row — like legacy dashboard */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <StatBox label="منشور" value={publishedCount} href="/news?status=published" />
        <StatBox label="للمراجعة" value={reviewCount} href="/admin/review" />
        <StatBox label="مسودات" value={draftCount} href="/news?status=draft" />
        <StatBox label="مرفوض" value={rejectedCount} href="/news?status=rejected" />
        <StatBox label="مؤرشف" value={archivedCount} href="/news?status=archived" />
        <StatBox label="قرارات AI" value={aiDecisionsCount} href="/admin/logs" />
      </div>

      {/* Pending review table — main element like legacy */}
      <div className="bg-white border border-gray-200 rounded-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-bold text-navy">📝 في انتظار المراجعة</h2>
          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{reviewCount}</span>
        </div>
        {pendingReview.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">لا توجد أخبار في انتظار المراجعة</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-muted-foreground">
                  <th className="text-right px-4 py-2 font-medium">العنوان</th>
                  <th className="text-right px-4 py-2 font-medium">التصنيف</th>
                  <th className="text-right px-4 py-2 font-medium">المنطقة</th>
                  <th className="text-right px-4 py-2 font-medium">الناشر</th>
                  <th className="text-right px-4 py-2 font-medium">التاريخ</th>
                  <th className="text-center px-4 py-2 font-medium">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {pendingReview.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-navy">{item.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.category?.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.region?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.createdBy?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fmtDate(item.updatedAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/news/${item.slug}/edit`} className="text-gold hover:text-navy font-bold transition-colors">
                        مراجعة
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold text-navy mb-3">⚡ الإجراءات السريعة</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/news/create" className="flex items-center gap-1 bg-navy text-white px-4 py-2 rounded-sm text-xs font-bold hover:bg-navy-light transition-colors">
            <span>+</span> خبر جديد
          </Link>
          <Link href="/admin/breaking-news" className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-sm text-xs font-bold hover:bg-red-700 transition-colors">
            <span>+</span> خبر عاجل
          </Link>
          <Link href="/admin/ads" className="flex items-center gap-1 bg-amber-600 text-white px-4 py-2 rounded-sm text-xs font-bold hover:bg-amber-700 transition-colors">
            <span>+</span> إعلان جديد
          </Link>
          <Link href="/admin/media" className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-sm text-xs font-bold hover:bg-green-700 transition-colors">
            <span>+</span> رفع وسائط
          </Link>
        </div>
      </div>

      {/* Latest AI decisions */}
      <div className="bg-white border border-gray-200 rounded-sm p-4">
        <h2 className="text-sm font-bold text-navy mb-3">🕐 آخر قرارات AI</h2>
        {latestAiDecisions.length === 0 ? (
          <p className="text-xs text-muted-foreground">لا توجد قرارات AI بعد</p>
        ) : (
          <div className="space-y-2">
            {latestAiDecisions.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-navy truncate">{log.details ?? log.action}</p>
                  <p className="text-[10px] text-muted-foreground">{log.user?.name} • {fmtDate(log.createdAt)}</p>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full shrink-0 mr-2">{log.action.replace("AI_", "")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="bg-white border border-gray-200 rounded-lg p-4 block hover:border-gold/50 transition-colors">
      <span className="text-xs text-muted-foreground block">{label}</span>
      <p className="text-2xl font-black text-navy mt-1">{value}</p>
    </Link>
  );
}
