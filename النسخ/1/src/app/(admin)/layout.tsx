import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/news" className="font-bold text-lg tracking-tight">
              الصوت المحلي
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/news"
                className="text-xs px-3 py-1.5 rounded-sm hover:bg-white/10 transition-colors"
              >
                الأخبار
              </Link>
              <Link
                href="/news/create"
                className="text-xs px-3 py-1.5 rounded-sm hover:bg-white/10 transition-colors"
              >
                خبر جديد
              </Link>
            </nav>
          </div>
          <Link
            href="/"
            className="text-xs text-gold hover:text-gold-light transition-colors"
          >
            العودة إلى الموقع
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      <Toaster />
    </div>
  );
}
