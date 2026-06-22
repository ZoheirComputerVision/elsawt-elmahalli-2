import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">إدارة المستخدمين</h1>
          <a
            href="/api/auth/logout"
            className="text-xs text-gold hover:text-gold-light transition-colors"
          >
            تسجيل الخروج
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <a href="/admin" className="text-sm text-navy hover:text-gold transition-colors">
              الرئيسية
            </a>
            <span className="text-sm font-bold text-gold border-b-2 border-gold">
              المستخدمون
            </span>
          </div>
          <a
            href="/admin/users/create"
            className="bg-gold hover:bg-gold-light text-navy text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            + مستخدم جديد
          </a>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-right px-4 py-3 font-bold text-navy">الاسم</th>
                <th className="text-right px-4 py-3 font-bold text-navy">البريد</th>
                <th className="text-right px-4 py-3 font-bold text-navy">الدور</th>
                <th className="text-right px-4 py-3 font-bold text-navy">الحالة</th>
                <th className="text-right px-4 py-3 font-bold text-navy">آخر دخول</th>
                <th className="text-left px-4 py-3 font-bold text-navy">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        u.role === "ADMIN"
                          ? "bg-gold/20 text-gold"
                          : u.role === "EDITOR"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.role === "ADMIN"
                        ? "مدير"
                        : u.role === "EDITOR"
                          ? "محرر"
                          : "مراسل"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        u.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.active ? "نشط" : "موقوف"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {u.lastLoginAt
                      ? new Date(u.lastLoginAt).toLocaleDateString("ar-SA")
                      : "---"}
                  </td>
                  <td className="px-4 py-3 text-left">
                    <a
                      href={`/admin/users/${u.id}`}
                      className="text-gold hover:text-navy text-xs font-semibold transition-colors"
                    >
                      تعديل
                    </a>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    لا يوجد مستخدمون
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
