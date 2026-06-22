"use client";

import { useState, useEffect, useCallback } from "react";

interface AdItem {
  id: string;
  title: string;
  content: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  position: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  clicks: number;
  createdAt: string;
}

const POSITIONS = [
  { value: "sidebar", label: "الشريط الجانبي" },
  { value: "banner_top", label: "بانر أعلى" },
  { value: "banner_bottom", label: "بانر أسفل" },
  { value: "inline", label: "داخل المحتوى" },
  { value: "popup", label: "نافذة منبثقة" },
];

export default function AdminAdsPage() {
  const [items, setItems] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdItem | null>(null);
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "", linkUrl: "", position: "sidebar", status: "active", startDate: "", endDate: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/ads?${params}`);
      const json = await res.json();
      if (json.success) setItems(json.data ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]); // eslint-disable-line react-hooks/set-state-in-effect

  function resetForm() {
    setForm({ title: "", content: "", imageUrl: "", linkUrl: "", position: "sidebar", status: "active", startDate: "", endDate: "" });
    setEditing(null);
  }

  function openEdit(item: AdItem) {
    setForm({
      title: item.title,
      content: item.content ?? "",
      imageUrl: item.imageUrl ?? "",
      linkUrl: item.linkUrl ?? "",
      position: item.position,
      status: item.status,
      startDate: item.startDate ? item.startDate.slice(0, 16) : "",
      endDate: item.endDate ? item.endDate.slice(0, 16) : "",
    });
    setEditing(item);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/ads/${editing.id}` : "/api/ads";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (json.success) { load(); setShowForm(false); resetForm(); }
      else alert(json.error || "فشل الحفظ");
    } catch { alert("فشل الاتصال بالخادم"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      const res = await fetch(`/api/ads/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) load();
      else alert(json.error || "فشل الحذف");
    } catch { alert("فشل الاتصال بالخادم"); }
  }

  const positionLabel = (v: string) => POSITIONS.find((p) => p.value === v)?.label ?? v;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">إدارة الإعلانات</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} إعلان</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-gold hover:bg-gold-light text-navy text-sm font-bold px-4 py-2 rounded-lg transition-colors">
          + إعلان جديد
        </button>
      </div>

      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في الإعلانات..." className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />

      {loading && <div className="text-center py-10"><div className="inline-block w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-right px-4 py-3 font-bold text-navy">العنوان</th>
                <th className="text-right px-4 py-3 font-bold text-navy">الموضع</th>
                <th className="text-right px-4 py-3 font-bold text-navy">الحالة</th>
                <th className="text-right px-4 py-3 font-bold text-navy">النقرات</th>
                <th className="text-left px-4 py-3 font-bold text-navy">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy">{item.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{positionLabel(item.position)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {item.status === "active" ? "نشط" : "متوقف"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.clicks}</td>
                  <td className="px-4 py-3 text-left">
                    <button onClick={() => openEdit(item)} className="text-gold hover:text-navy text-xs font-semibold transition-colors mr-2">تعديل</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors">حذف</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">لا توجد إعلانات</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-navy mb-4">{editing ? "تعديل إعلان" : "إعلان جديد"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">العنوان *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy mb-1">المحتوى</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">رابط الصورة</label>
                  <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">رابط الإعلان</label>
                  <input value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">الموضع</label>
                  <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold">
                    {POSITIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">الحالة</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold">
                    <option value="active">نشط</option>
                    <option value="paused">متوقف</option>
                    <option value="expired">منتهي</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">تاريخ البداية</label>
                  <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">تاريخ النهاية</label>
                  <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="bg-gold hover:bg-gold-light text-navy text-sm font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-50">
                  {saving ? "جاري الحفظ..." : editing ? "تحديث" : "إضافة"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-muted-foreground text-sm px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
