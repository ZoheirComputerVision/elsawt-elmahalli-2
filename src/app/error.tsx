"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("=== ERROR BOUNDARY CAUGHT ===", error);
    console.error("Message:", error.message);
    console.error("Digest:", error.digest);
    console.error("Stack:", error.stack);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
      <div className="text-center px-4 max-w-md">
        <h1 className="text-4xl font-black text-navy mb-2">عذراً!</h1>
        <p className="text-muted-foreground mb-6">حدث خطأ غير متوقع. الفريق التقني تم إشعاره.</p>

        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 text-right">
            <details open>
              <summary className="text-xs font-bold text-red-600 cursor-pointer mb-2">تفاصيل الخطأ (بيئة التطوير)</summary>
              <pre className="bg-red-50 border border-red-200 rounded-sm p-3 text-[10px] text-red-800 leading-relaxed overflow-auto max-h-64 text-left font-mono whitespace-pre-wrap">
                {error.stack ?? error.message}
              </pre>
              {error.digest && (
                <p className="text-[10px] text-muted-foreground mt-1">Digest: {error.digest}</p>
              )}
            </details>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-gold hover:bg-gold-light text-navy font-bold px-6 py-2.5 rounded-lg transition-colors text-sm cursor-pointer"
          >
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="border border-gray-300 hover:bg-gray-50 text-muted-foreground font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
