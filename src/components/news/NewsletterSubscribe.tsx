"use client";

import { useState } from "react";

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        setMessage("تم الاشتراك بنجاح! شكراً لك.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(json.error || "حدث خطأ");
      }
    } catch {
      setStatus("error");
      setMessage("فشل الاتصال بالخادم");
    }
  }

  return (
    <div className="bg-navy rounded-sm p-6 text-center">
      <h3 className="text-gold font-bold text-lg mb-2">النشرة البريدية</h3>
      <p className="text-white/80 text-sm mb-4">اشترك لتصلك آخر الأخبار المحلية مباشرة إلى بريدك الإلكتروني</p>
      {status === "success" ? (
        <p className="text-green-400 font-bold">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="بريدك الإلكتروني"
            required
            className="flex-1 px-3 py-2 rounded-sm text-sm text-navy focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-gold hover:bg-gold-light text-navy font-bold px-4 py-2 rounded-sm text-sm transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "..." : "اشتراك"}
          </button>
        </form>
      )}
      {status === "error" && <p className="text-red-400 text-xs mt-2">{message}</p>}
    </div>
  );
}
