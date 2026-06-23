import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const logs = await prisma.auditLog.findMany({
    where: { action: { startsWith: "AI_" } },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const fmtDate = (d: Date) =>
    d.toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <h1 className="text-xl font-bold text-navy mb-6">سجل AI</h1>

      {logs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm p-8 text-center">
          <p className="text-muted-foreground">لا توجد قرارات AI بعد</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-muted-foreground border-b border-gray-100">
                <th className="text-right px-4 py-3 font-medium">#</th>
                <th className="text-right px-4 py-3 font-medium">القرار</th>
                <th className="text-right px-4 py-3 font-medium">التفاصيل</th>
                <th className="text-right px-4 py-3 font-medium">المستخدم</th>
                <th className="text-right px-4 py-3 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-muted-foreground font-mono">{log.id.slice(0, 8)}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">
                      {log.action.replace("AI_", "")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-navy">{log.details ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{log.user?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
