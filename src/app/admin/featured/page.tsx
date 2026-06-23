import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FeaturedPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const allNews = await prisma.news.findMany({
    where: { status: "published" },
    include: { category: { select: { name: true } }, createdBy: { select: { name: true } } },
    orderBy: [{ viewCount: "desc" }, { publishedAt: "desc" }],
    take: 20,
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-navy mb-6">الخبر الرئيسي</h1>

      <div className="bg-white border border-gray-200 rounded-sm p-4 mb-4">
        <p className="text-xs text-muted-foreground mb-3">اختر الخبر الذي يظهر في الواجهة الرئيسية.</p>

        {allNews.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">لا توجد أخبار منشورة بعد</p>
        ) : (
          <div className="space-y-2">
            {allNews.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-sm transition-colors">
                <span className="text-[10px] text-muted-foreground w-5 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground">{item.category?.name} • {item.createdBy?.name}</p>
                </div>
                <Link href={`/news/${item.slug}/edit`} className="text-[10px] text-gold hover:text-navy font-bold shrink-0">
                  تعيين كرئيسي
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
