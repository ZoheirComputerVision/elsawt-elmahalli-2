import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
      <div className="text-center px-4 max-w-md">
        <span className="text-7xl font-black text-navy block mb-2">404</span>
        <p className="text-lg text-muted-foreground mb-6">الصفحة التي تبحث عنها غير موجودة</p>
        <Link
          href="/"
          className="inline-block bg-gold hover:bg-gold-light text-navy font-bold px-6 py-2.5 rounded-lg transition-colors text-sm"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}
