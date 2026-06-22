"use client";

import { useState, useEffect, useCallback } from "react";

interface WilayaOption { id: string; name: string; }
interface DairaItem { id: string; name: string; slug: string; active: boolean; wilayaId: string; wilayaName: string; communesCount: number; }

export default function AdminDairasPage() {
  const [items, setItems] = useState<DairaItem[]>([]);
  const [wilayas, setWilayas] = useState<WilayaOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [wilayaFilter, setWilayaFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DairaItem | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", wilayaId: "", active: true });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [wilayasRes] = await Promise.all([
        fetch("/api/geographic/wilayas"),
      ]);
      const wData = await wilayasRes.json();
      const wList: WilayaOption[] = wData.success ? (wData.data ?? []) : [];
      setWilayas(wList);

      const params = wilayaFilter ? `?wilayaId=${wilayaFilter}` : "";
      const res = await fetch(`/api/geographic/dairas${params}`);
      const json = await res.json();
      if (json.success) setItems(json.data ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [wilayaFilter]);

  useEffect(() => { load(); }, [load]);

  function resetForm() { setForm({ name: "", slug: "", wilayaId: wilayaFilter || "", active: true }); setEditing(null); }

  function openEdit(item: DairaItem) {
    setForm({ name: item.name, slug: item.slug, wilayaId: item.wilayaId, active: item.active });
    setEditing(item);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/geographic/dairas/${editing.id}` : "/api/geographic/dairas";
      const method = editing ? "PUT" : "POST";
      const body = { name: form.name, slug: form.slug, wilayaId: form.wilayaId, active: form.active };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (json.success) { load(); setShowForm(false); resetForm(); }
      else alert(json.error || "فشل الحفظ");
    } catch { alert("فشل الاتصال بالخادم"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه الدائرة؟")) return;
    try {
      const res = await fetch(`/api/geographic/dairas/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) load();
      else alert(json.error || "فشل الحذف");
    } catch { alert("فشل الاتصال بالخادم"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">الدوائر</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} دائرة</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-gold hover:bg-gold-light text-navy text-sm font-bold px-4 py-2 rounded-lg transition-colors">
          + دائرة جديدة
        </button>
      </div>

      <div className="flex gap-3">
        <select value={wilayaFilter} onChange={(e) => setWilayaFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold">
          <option value="">كل الولايات</option>
          {wilayas.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      {loading && <div className="text-center py-10"><div className="inline-block w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-right px-4 py-3 font-bold text-navy">الدائرة</th>
                <th className="text-right px-4 py-3 font-bold text-navy">الولاية</th>
                <th className="text-right px-4 py-3 font-bold text-navy">البلديات</th>
                <th className="text-right px-4 py-3 font-bold text-navy">الحالة</th>
                <th className="text-left px-4 py-3 font-bold text-navy">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.wilayaName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.communesCount}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {item.active ? "نشط" : "موقوف"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <button onClick={() => openEdit(item)} className="text-gold hover:text-navy text-xs font-semibold transition-colors mr-2">تعديل</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors">حذف</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">لا توجد دوائر</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-navy mb-4">{editing ? "تعديل دائرة" : "دائرة جديدة"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">الولاية *</label>
                <select required value={form.wilayaId} onChange={(e) => setForm({ ...form, wilayaId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold">
                  <option value="">اختر الولاية</option>
                  {wilayas.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-navy mb-1">اسم الدائرة *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy mb-1">المعرف (slug) *</label>
                <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="bg-gold hover:bg-gold-light text-navy text-sm font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-50">
                  {saving ? "جاري الحفظ..." : editing ? "تحديث" : "إضافة"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 text-muted-foreground text-sm px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
