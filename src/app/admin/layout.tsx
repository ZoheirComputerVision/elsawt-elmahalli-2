import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "الرئيسية", icon: "📊" },
  { href: "/admin/review", label: "مراجعة المحتوى", icon: "📝" },
  { href: "/news", label: "الأخبار", icon: "📰" },
  { href: "/admin/media", label: "مكتبة الوسائط", icon: "🖼" },
  { href: "/admin/featured", label: "الخبر الرئيسي", icon: "⭐" },
  { href: "/admin/breaking-news", label: "الأخبار العاجلة", icon: "📢" },
  { href: "/admin/users", label: "المستخدمون", icon: "👥" },
  { href: "/admin/logs", label: "سجل AI", icon: "📋" },
  { href: "/admin/settings", label: "الإعدادات", icon: "⚙️" },
  { href: "/admin/ads", label: "الإعلانات", icon: "📺" },
  { href: "/admin/social", label: "التواصل", icon: "📱" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-navy text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="font-bold text-lg tracking-tight">
              الصوت المحلي
            </Link>
            <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">
              {session.user.role}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-gray-300 hover:text-gold transition-colors">
              🏠 الموقع
            </Link>
            <span className="text-sm text-gray-300 hidden sm:block">{session.user.name}</span>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/auth/logout" className="text-xs text-gold hover:text-gold-light transition-colors">
              تسجيل الخروج
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex gap-4 mb-6 border-b border-gray-200 pb-3 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-navy hover:text-gold transition-colors shrink-0 whitespace-nowrap"
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </div>
  );
}
