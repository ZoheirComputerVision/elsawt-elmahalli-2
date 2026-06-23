"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [stopAuto, setStopAuto] = useState(false);
  const [requireReview, setRequireReview] = useState(false);
  const [stats, setStats] = useState<{ lastSchedulerRun: string; publishDate: string; publishTitle: string; totalPublishedToday: number } | null>(null);
  const [msg, setMsg] = useState<{ type: string; text: string } | null>(null);
  const [exportResult, setExportResult] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setStopAuto(data.settings.stop_auto_publish === "true");
        setRequireReview(data.settings.require_human_review === "true");
        setStats(data.stats);
      })
      .catch(() => setMsg({ type: "danger", text: "فشل تحميل الإعدادات" }));
  }, []);

  const toggle = async (key: string, value: boolean) => {
    try {
      const r = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: value.toString() }),
      });
      if (!r.ok) throw new Error("فشل التحديث");
      setMsg({ type: "success", text: `✅ تم تحديث الإعداد: ${key} = ${value}` });
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg({ type: "danger", text: "⚠️ فشل تحديث الإعداد" });
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {msg && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            marginBottom: 20,
            fontSize: "0.9rem",
            backgroundColor: msg.type === "success" ? "#f0fdf4" : "#fef2f2",
            border: msg.type === "success" ? "1px solid #bbf7d0" : "1px solid #fecaca",
            color: msg.type === "success" ? "#166534" : "#991b1b",
          }}
        >
          {msg.text}
        </div>
      )}

      {/* إعدادات الأمان */}
      <div className="bg-white border border-gray-200 rounded-sm mb-5">
        <div className="border-b border-gray-100 px-5 py-3 font-bold text-sm text-navy">
          ☢️ إعدادات الأمان (Safety Layer)
        </div>
        <div className="p-5 space-y-5">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              padding: "15px",
              backgroundColor: "#fef2f2",
              borderRadius: 8,
              border: "1px solid #fecaca",
            }}
          >
            <input
              type="checkbox"
              checked={stopAuto}
              onChange={(e) => { setStopAuto(e.target.checked); toggle("stop_auto_publish", e.target.checked); }}
            />
            <div>
              <strong style={{ color: "#991b1b", fontSize: "0.9rem" }}>🔴 إيقاف النشر التلقائي بالكامل</strong>
              <div style={{ fontSize: "0.85rem", color: "#666", marginTop: 2 }}>
                عند تفعيل هذا الخيار، لن ينشر أي محتوى تلقائيًا. كل المحتوى سيحتاج موافقة يدوية.
              </div>
            </div>
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              padding: "15px",
              backgroundColor: "#fefce8",
              borderRadius: 8,
              border: "1px solid #fde68a",
            }}
          >
            <input
              type="checkbox"
              checked={requireReview}
              onChange={(e) => { setRequireReview(e.target.checked); toggle("require_human_review", e.target.checked); }}
            />
            <div>
              <strong style={{ color: "#92400e", fontSize: "0.9rem" }}>⚠️ طلب مراجعة بشرية إلزامية</strong>
              <div style={{ fontSize: "0.85rem", color: "#666", marginTop: 2 }}>
                جميع المحتويات يجب أن تراجع بشريًا قبل النشر، حتى تلك ذات الثقة العالية.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* إحصائيات النظام */}
      <div className="bg-white border border-gray-200 rounded-sm mb-5">
        <div className="border-b border-gray-100 px-5 py-3 font-bold text-sm text-navy">
          📊 إحصائيات النظام
        </div>
        <div className="p-5">
          {stats ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: 16,
              }}
            >
              <div style={{ textAlign: "center", padding: "12px" }}>
                <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: 4 }}>⏱ آخر تشغيل</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e3a5f" }}>{stats.lastSchedulerRun}</div>
              </div>
              <div style={{ textAlign: "center", padding: "12px" }}>
                <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: 4 }}>📅 تاريخ النشر</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e3a5f" }}>{stats.publishDate}</div>
                <div style={{ fontSize: "0.75rem", color: "#999", marginTop: 2 }}>{stats.publishTitle !== "-" ? stats.publishTitle : ""}</div>
              </div>
              <div style={{ textAlign: "center", padding: "12px" }}>
                <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: 4 }}>📊 منشور اليوم</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1e3a5f" }}>{stats.totalPublishedToday}</div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: "0.85rem", color: "#999" }}>جاري التحميل...</div>
          )}
        </div>
      </div>

      {/* النسخ الاحتياطي */}
      <div className="bg-white border border-gray-200 rounded-sm mb-5">
        <div className="border-b border-gray-100 px-5 py-3 font-bold text-sm text-navy">
          📦 النسخ الاحتياطي
        </div>
        <div className="p-5">
          <button
            onClick={async () => {
              try {
                const r = await fetch("/api/admin/settings/export");
                const data = await r.json();
                setExportResult(`✅ تم التصدير: ${data.count} خبر — ${data.file}`);
              } catch {
                setExportResult("⚠️ فشل التصدير");
              }
            }}
            className="bg-amber-600 text-white px-5 py-2 rounded-sm text-sm font-bold hover:bg-amber-700 transition-colors cursor-pointer"
          >
            💾 تصدير الأرشيف (JSON)
          </button>
          {exportResult && (
            <div style={{ marginTop: 10, fontSize: "0.85rem", color: exportResult.startsWith("✅") ? "#166534" : "#991b1b" }}>
              {exportResult}
            </div>
          )}
        </div>
      </div>

      {/* معلومات النظام */}
      <div className="bg-white border border-gray-200 rounded-sm mb-5">
        <div className="border-b border-gray-100 px-5 py-3 font-bold text-sm text-navy">
          ℹ️ معلومات النظام
        </div>
        <div className="p-5" style={{ fontSize: "0.85rem", color: "#666", lineHeight: 2 }}>
          <p><strong>النظام:</strong> الصوت المحلي - نشرية جهوية للإعلام العام و التنمية المحلية v1.0</p>
          <p><strong>الجهة:</strong> ولاية تيارت</p>
          <p><strong>مصادر البيانات:</strong> المصادر الرسمية للولاية + إدخال يدوي</p>
          <p><strong>AI Pipeline:</strong> Classifier → Fact Checker → Writer → Publisher → Archiver</p>
          <p><strong>قاعدة البيانات:</strong> PostgreSQL</p>
        </div>
      </div>
    </div>
  );
}
