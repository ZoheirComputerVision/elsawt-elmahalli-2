import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin");

  const pageSize = 50;
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: pageSize,
    include: { user: { select: { name: true, email: true } } },
  });

  const total = await prisma.auditLog.count();

  const actionLabels: Record<string, string> = {
    LOGIN: "تسجيل دخول",
    CREATE_NEWS: "إنشاء خبر",
    UPDATE_NEWS: "تحديث خبر",
    DELETE_NEWS: "حذف خبر",
    CREATE_DIRECTORY_ENTRY: "إنشاء قيد دليل",
    UPDATE_DIRECTORY_ENTRY: "تحديث قيد دليل",
    DELETE_DIRECTORY_ENTRY: "حذف قيد دليل",
    CREATE_AD: "إنشاء إعلان",
    UPDATE_AD: "تحديث إعلان",
    DELETE_AD: "حذف إعلان",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">سجل التدقيق</h1>
        <p className="text-sm text-muted-foreground mt-1">إجمالي {total} عملية — آخر {logs.length}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-right px-4 py-3 font-bold text-navy">التاريخ</th>
              <th className="text-right px-4 py-3 font-bold text-navy">المستخدم</th>
              <th className="text-right px-4 py-3 font-bold text-navy">الإجراء</th>
              <th className="text-right px-4 py-3 font-bold text-navy">التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {log.createdAt.toLocaleDateString("ar-SA", {
                    year: "numeric", month: "short", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-navy">{log.user.name}</span>
                  <span className="text-xs text-muted-foreground block">{log.user.email}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {actionLabels[log.action] ?? log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{log.details}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">لا توجد عمليات</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
