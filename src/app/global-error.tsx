"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html dir="rtl">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center px-4 max-w-md">
            <h1 className="text-4xl font-black text-navy mb-2">خطأ في النظام</h1>
            <p className="text-muted-foreground mb-6">حدث عطل في البنية التحتية. يرجى المحاولة لاحقاً.</p>
            <button
              onClick={reset}
              className="bg-gold hover:bg-gold-light text-navy font-bold px-6 py-2.5 rounded-lg transition-colors text-sm cursor-pointer"
            >
              إعادة تحميل
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
