import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const subscriptions = await prisma.newsletterSubscription.findMany({
    orderBy: { createdAt: "desc" },
  });

  const total = subscriptions.length;
  const active = subscriptions.filter((s) => s.active).length;

  return (
    <div>
      <h1 className="text-xl font-bold text-navy mb-6">النشرة البريدية</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <span className="text-xs text-muted-foreground">إجمالي المشتركين</span>
          <p className="text-2xl font-black text-navy mt-1">{total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <span className="text-xs text-muted-foreground">مشتركين نشطين</span>
          <p className="text-2xl font-black text-green-600 mt-1">{active}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-right px-4 py-2 text-xs font-bold text-navy">البريد الإلكتروني</th>
              <th className="text-right px-4 py-2 text-xs font-bold text-navy">الاسم</th>
              <th className="text-right px-4 py-2 text-xs font-bold text-navy">الحالة</th>
              <th className="text-right px-4 py-2 text-xs font-bold text-navy">تاريخ الاشتراك</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2 text-xs text-navy">{s.email}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{s.name ?? "—"}</td>
                <td className="px-4 py-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${s.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {s.active ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs text-muted-foreground">
                  {s.createdAt.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                </td>
              </tr>
            ))}
            {subscriptions.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-xs text-muted-foreground">لا يوجد مشتركون بعد</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
