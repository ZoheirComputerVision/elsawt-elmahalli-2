import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const items = await prisma.news.findMany({
    where: { status: "review" },
    include: {
      category: { select: { name: true } },
      region: { select: { name: true } },
      createdBy: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-navy">مراجعة المحتوى</h1>
        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">{items.length} في انتظار المراجعة</span>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
          <p className="text-muted-foreground">✅ لا يوجد محتوى في انتظار المراجعة</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-muted-foreground border-b border-gray-100">
                <th className="text-right px-4 py-3 font-medium">العنوان</th>
                <th className="text-right px-4 py-3 font-medium">التصنيف</th>
                <th className="text-right px-4 py-3 font-medium">المنطقة</th>
                <th className="text-right px-4 py-3 font-medium">الناشر</th>
                <th className="text-right px-4 py-3 font-medium">التاريخ</th>
                <th className="text-center px-4 py-3 font-medium">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy">{item.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.region?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.createdBy?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.updatedAt.toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
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
  );
}
