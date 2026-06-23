import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

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
          <Link href="/admin" className="text-sm font-bold text-gold border-b-2 border-gold pb-3 -mb-[1px] shrink-0">
            الرئيسية
          </Link>
          <Link href="/admin/workspace" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            مساحة العمل
          </Link>
          <Link href="/admin/coverage" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            التغطية
          </Link>
          <Link href="/admin/coverage/score" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            مؤشر التغطية
          </Link>
          <Link href="/admin/coverage/gaps" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            الثغرات
          </Link>
          <Link href="/admin/reporters/ranking" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            ترتيب المراسلين
          </Link>
          <Link href="/admin/geographic/search" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            بحث جغرافي
          </Link>
          <Link href="/admin/assignments" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            المهام
          </Link>
          <Link href="/news" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            الأخبار
          </Link>
          <Link href="/admin/media" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            الوسائط
          </Link>
          <Link href="/admin/directory" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            الدليل الاقتصادي
          </Link>
          <Link href="/admin/breaking-news" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            التنبيهات
          </Link>
          <Link href="/admin/ads" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            الإعلانات
          </Link>
          <Link href="/admin/wilayas" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            الولايات
          </Link>
          <Link href="/admin/dairas" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            الدوائر
          </Link>
          <Link href="/admin/communes" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            البلديات
          </Link>
          <Link href="/admin/audit" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            سجل التدقيق
          </Link>
          <Link href="/admin/reporters" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            المراسلون
          </Link>
          <Link href="/admin/users" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            المستخدمون
          </Link>
          <Link href="/admin/newsletter" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            النشرة البريدية
          </Link>
          <Link href="/admin/contact" className="text-sm text-navy hover:text-gold transition-colors shrink-0">
            رسائل التواصل
          </Link>
        </nav>

        {children}
      </div>
    </div>
  );
}
