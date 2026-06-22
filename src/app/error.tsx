"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logger.error("Global error boundary caught", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white" dir="rtl">
      <div className="text-center px-4 max-w-md">
        <h1 className="text-4xl font-black text-navy mb-2">عذراً!</h1>
        <p className="text-muted-foreground mb-6">حدث خطأ غير متوقع. الفريق التقني تم إشعاره.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-gold hover:bg-gold-light text-navy font-bold px-6 py-2.5 rounded-lg transition-colors text-sm cursor-pointer"
          >
            إعادة المحاولة
          </button>
          <a
            href="/"
            className="border border-gray-300 hover:bg-gray-50 text-muted-foreground font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            الصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
