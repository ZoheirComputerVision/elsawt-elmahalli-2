"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Trash2, Globe, AlertTriangle, AlertCircle, AlertOctagon } from "lucide-react";

interface AlertRow {
  id: string;
  title: string;
  content: string | null;
  link: string | null;
  priority: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  createdBy: { id: string; name: string };
}

const priorityConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  urgent: { label: "عاجل جداً", icon: <AlertOctagon className="w-3 h-3" />, color: "text-red-600 bg-red-50 border-red-200" },
  high: { label: "عاجل", icon: <AlertTriangle className="w-3 h-3" />, color: "text-orange-600 bg-orange-50 border-orange-200" },
  medium: { label: "مهم", icon: <AlertCircle className="w-3 h-3" />, color: "text-amber-600 bg-amber-50 border-amber-200" },
  low: { label: "عادي", icon: <Globe className="w-3 h-3" />, color: "text-gray-600 bg-gray-50 border-gray-200" },
};

export default function BreakingNewsAdmin() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", link: "", priority: "high", expiresAt: "" });

  const load = useCallback(async () => {
    const res = await fetch("/api/breaking-news");
    const json = await res.json();
    if (json.success) setAlerts(json.data);
    setLoading(false);
  }, []);

  const mounted = useRef(false);
  useEffect(() => { if (!mounted.current) { mounted.current = true; load(); } }, [load]);

  const create = async () => {
    setError("");
    const res = await fetch("/api/breaking-news", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, expiresAt: form.expiresAt || null }),
    });
    const json = await res.json();
    if (json.success) { setShowForm(false); setForm({ title: "", content: "", link: "", priority: "high", expiresAt: "" }); load(); }
    else setError(json.error || "فشل الإنشاء");
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/breaking-news/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    load();
  };

  const remove = async (id: string) => {
    await fetch(`/api/breaking-news/${id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <p className="text-sm text-muted-foreground">جاري التحميل...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-navy">التنبيهات العاجلة</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 bg-navy text-white px-4 py-2 rounded-sm text-xs font-bold">
          <Plus className="w-3 h-3" /> {showForm ? "إلغاء" : "تنبيه جديد"}
        </button>
      </div>

      {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input placeholder="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
          <input placeholder="المحتوى (اختياري)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
          <input placeholder="الرابط (اختياري)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs">
            <option value="urgent">عاجل جداً</option><option value="high">عاجل</option><option value="medium">مهم</option><option value="low">عادي</option>
          </select>
          <input type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
          <button onClick={create} className="bg-green-600 text-white px-4 py-2 rounded-sm text-xs font-bold">نشر التنبيه</button>
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((a) => {
          const pc = priorityConfig[a.priority] ?? priorityConfig.high;
          return (
            <div key={a.id} className={`bg-white border rounded-sm p-4 ${a.isActive ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${pc.color}`}>{pc.icon} {pc.label}</span>
                    <h3 className="text-sm font-bold text-navy">{a.title}</h3>
                  </div>
                  {a.content && <p className="text-xs text-muted-foreground mb-1">{a.content}</p>}
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>بواسطة: {a.createdBy.name}</span>
                    {a.expiresAt && <span>ينتهي: {new Date(a.expiresAt).toLocaleDateString("ar-SA")}</span>}
                    <span>{a.isActive ? "نشط" : "غير نشط"}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleActive(a.id, a.isActive)} className={`text-[10px] px-2 py-1 rounded-sm font-bold border ${a.isActive ? "border-amber-200 text-amber-600" : "border-green-200 text-green-600"}`}>
                    {a.isActive ? "إيقاف" : "تفعيل"}
                  </button>
                  <button onClick={() => remove(a.id)} className="text-[10px] px-2 py-1 rounded-sm font-bold border border-red-200 text-red-600">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {alerts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">لا توجد تنبيهات عاجلة</p>}
      </div>
    </div>
  );
}
