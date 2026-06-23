import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminReportersPage() {
  const reporters = await prisma.user.findMany({
    where: { role: "REPORTER" },
    include: {
      commune: { include: { daira: { include: { wilaya: true } } } },
      _count: { select: { news: true } },
    },
    orderBy: { name: "asc" },
  });

  const total = reporters.length;
  const active = reporters.filter((r) => r.active).length;
  const withArticles = reporters.filter((r) => r._count.news > 0).length;

  return (
    <div>
      <h1 className="text-xl font-bold text-navy mb-6">إدارة المراسلين</h1>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <span className="text-xs text-muted-foreground">إجمالي المراسلين</span>
          <p className="text-2xl font-black text-navy mt-1">{total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <span className="text-xs text-muted-foreground">نشط</span>
          <p className="text-2xl font-black text-green-600 mt-1">{active}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <span className="text-xs text-muted-foreground">لديهم مقالات</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{withArticles}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-right px-4 py-2 text-[10px] font-bold text-navy">الاسم</th>
              <th className="text-right px-4 py-2 text-[10px] font-bold text-navy">التخصص</th>
              <th className="text-right px-4 py-2 text-[10px] font-bold text-navy hidden md:table-cell">المنطقة</th>
              <th className="text-right px-4 py-2 text-[10px] font-bold text-navy">المقالات</th>
              <th className="text-right px-4 py-2 text-[10px] font-bold text-navy">الحالة</th>
              <th className="text-right px-4 py-2 text-[10px] font-bold text-navy">الملف</th>
            </tr>
          </thead>
          <tbody>
            {reporters.map((r) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2 text-xs text-navy">{r.name}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{r.specialization ?? "—"}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground hidden md:table-cell">
                  {r.commune ? `${r.commune.daira.wilaya.name} > ${r.commune.daira.name}` : "—"}
                </td>
                <td className="px-4 py-2 text-xs text-navy font-semibold">{r._count.news}</td>
                <td className="px-4 py-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${r.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {r.active ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Link href={`/reporters/${r.id}`} className="text-[10px] text-gold hover:text-navy font-semibold transition-colors">
                    عرض
                  </Link>
                </td>
              </tr>
            ))}
            {reporters.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">لا يوجد مراسلون بعد</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
