"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ type: "general", name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (json.success) { setStatus("success"); setForm({ type: "general", name: "", email: "", phone: "", subject: "", message: "" }); }
      else { setStatus("error"); }
    } catch { setStatus("error"); }
  }

  const types = [
    { value: "general", label: "تواصل عام" },
    { value: "news_tip", label: "اقتراح خبر" },
    { value: "correction", label: "تصحيح خبر" },
    { value: "report", label: "بلاغ محلي" },
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-lg font-black text-navy tracking-tight">الصوت المحلي</span>
          <Link href="/" className="text-xs text-gold hover:text-navy transition-colors font-semibold">العودة إلى الرئيسية</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-navy mb-2">اتصل بنا</h1>
        <p className="text-sm text-muted-foreground mb-8">نرحب باقتراحاتكم وملاحظاتكم وبلاغاتكم</p>

        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 rounded-sm p-6 text-center">
            <p className="text-green-700 font-bold text-lg">تم إرسال رسالتك بنجاح</p>
            <p className="text-green-600 text-sm mt-1">سيتم مراجعتها من قبل الفريق في أقرب وقت</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy mb-1">نوع الرسالة</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold">
                {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">الاسم</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy mb-1">البريد الإلكتروني</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">الهاتف (اختياري)</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy mb-1">الموضوع (اختياري)</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-navy mb-1">الرسالة</label>
              <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold resize-y" />
            </div>
            <button type="submit" disabled={status === "loading"} className="bg-gold hover:bg-gold-light text-navy font-bold px-6 py-2.5 rounded-sm text-sm transition-colors disabled:opacity-50">
              {status === "loading" ? "جاري الإرسال..." : "إرسال"}
            </button>
            {status === "error" && <p className="text-red-500 text-xs">حدث خطأ. حاول مرة أخرى.</p>}
          </form>
        )}
      </div>
    </div>
  );
}
