import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReporterWorkspacePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;
  const isReporter = session.user.role === "REPORTER";

  const [myNews, stats] = await Promise.all([
    prisma.news.findMany({
      where: isReporter ? { createdById: userId } : {},
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: {
        category: { select: { name: true } },
        region: { select: { name: true } },
      },
    }),
    isReporter
      ? {
          total: await prisma.news.count({ where: { createdById: userId } }),
          drafts: await prisma.news.count({ where: { createdById: userId, status: "draft" } }),
          review: await prisma.news.count({ where: { createdById: userId, status: "review" } }),
          published: await prisma.news.count({ where: { createdById: userId, status: "published" } }),
        }
      : null,
  ]);

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-600",
    review: "bg-amber-100 text-amber-700",
    approved: "bg-blue-100 text-blue-700",
    published: "bg-green-100 text-green-700",
    archived: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    draft: "مسودة",
    review: "قيد المراجعة",
    approved: "معتمد",
    published: "منشور",
    archived: "مؤرشف",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">مساحة العمل</h1>
        <p className="text-sm text-muted-foreground mt-1">مرحباً، {session.user.name}</p>
      </div>

      {isReporter && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <span className="text-xs text-muted-foreground block">إجمالي أخباري</span>
            <p className="text-2xl font-black text-navy mt-1">{stats.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <span className="text-xs text-muted-foreground block">مسودة</span>
            <p className="text-2xl font-black text-gray-500 mt-1">{stats.drafts}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <span className="text-xs text-muted-foreground block">قيد المراجعة</span>
            <p className="text-2xl font-black text-amber-600 mt-1">{stats.review}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <span className="text-xs text-muted-foreground block">منشور</span>
            <p className="text-2xl font-black text-green-600 mt-1">{stats.published}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-navy">
          {isReporter ? "أخباري" : "جميع الأخبار (المسؤول)"}
        </h2>
        <Link href="/news/create" className="bg-gold hover:bg-gold-light text-navy text-sm font-bold px-4 py-2 rounded-lg transition-colors">
          + خبر جديد
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-right px-4 py-3 font-bold text-navy">العنوان</th>
              <th className="text-right px-4 py-3 font-bold text-navy">التصنيف</th>
              <th className="text-right px-4 py-3 font-bold text-navy">الحالة</th>
              <th className="text-right px-4 py-3 font-bold text-navy">آخر تحديث</th>
              <th className="text-left px-4 py-3 font-bold text-navy">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {myNews.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-navy truncate max-w-[250px]">{item.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.category.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColors[item.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[item.status] ?? item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {item.updatedAt.toLocaleDateString("ar-SA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-4 py-3 text-left">
                  <Link href={`/news/${item.slug}/edit`} className="text-gold hover:text-navy text-xs font-semibold transition-colors">
                    تحرير
                  </Link>
                </td>
              </tr>
            ))}
            {myNews.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                {isReporter ? "لم تنشر أي خبر بعد. ابدأ بكتابة خبر جديد!" : "لا توجد أخبار"}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
