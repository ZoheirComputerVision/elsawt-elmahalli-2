"use client";

import { useState, useEffect, useCallback } from "react";

interface DairaOption { id: string; name: string; wilayaName: string; }
interface CommuneItem { id: string; name: string; slug: string; active: boolean; dairaId: string; dairaName: string; wilayaName: string; }

export default function AdminCommunesPage() {
  const [items, setItems] = useState<CommuneItem[]>([]);
  const [dairas, setDairas] = useState<DairaOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [dairaFilter, setDairaFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CommuneItem | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", dairaId: "", active: true });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [wilayasRes] = await Promise.all([fetch("/api/geographic/wilayas")]);
      const wData = await wilayasRes.json();
      const wList: { id: string; name: string }[] = wData.success ? (wData.data ?? []) : [];

      const allDairas: DairaOption[] = [];
      for (const w of wList) {
        const res = await fetch(`/api/geographic/dairas?wilayaId=${w.id}`);
        const json = await res.json();
        if (json.success) {
          for (const d of json.data ?? []) {
            allDairas.push({ id: d.id, name: d.name, wilayaName: d.wilayaName });
          }
        }
      }
      setDairas(allDairas);

      let communes: CommuneItem[] = [];
      if (dairaFilter) {
        const res = await fetch(`/api/geographic/communes?dairaId=${dairaFilter}`);
        const json = await res.json();
        if (json.success) communes = json.data ?? [];
      } else {
        const results = await Promise.all(allDairas.map((d) => fetch(`/api/geographic/communes?dairaId=${d.id}`).then((r) => r.json())));
        for (const json of results) {
          if (json.success) communes.push(...(json.data ?? []));
        }
      }
      setItems(communes);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [dairaFilter]);

  useEffect(() => { load(); }, [load]); // eslint-disable-line react-hooks/set-state-in-effect

  function resetForm() { setForm({ name: "", slug: "", dairaId: dairaFilter || "", active: true }); setEditing(null); }

  function openEdit(item: CommuneItem) {
    setForm({ name: item.name, slug: item.slug, dairaId: item.dairaId, active: item.active });
    setEditing(item);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/geographic/communes/${editing.id}` : "/api/geographic/communes";
      const method = editing ? "PUT" : "POST";
      const body = { name: form.name, slug: form.slug, dairaId: form.dairaId, active: form.active };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (json.success) { load(); setShowForm(false); resetForm(); }
      else alert(json.error || "فشل الحفظ");
    } catch { alert("فشل الاتصال بالخادم"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه البلدية؟")) return;
    try {
      const res = await fetch(`/api/geographic/communes/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) load();
      else alert(json.error || "فشل الحذف");
    } catch { alert("فشل الاتصال بالخادم"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">البلديات</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} بلدية</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-gold hover:bg-gold-light text-navy text-sm font-bold px-4 py-2 rounded-lg transition-colors">
          + بلدية جديدة
        </button>
      </div>

      <div className="flex gap-3">
        <select value={dairaFilter} onChange={(e) => setDairaFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold">
          <option value="">كل الدوائر</option>
          {dairas.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.wilayaName})</option>)}
        </select>
      </div>

      {loading && <div className="text-center py-10"><div className="inline-block w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-right px-4 py-3 font-bold text-navy">البلدية</th>
                <th className="text-right px-4 py-3 font-bold text-navy">الدائرة</th>
                <th className="text-right px-4 py-3 font-bold text-navy">الولاية</th>
                <th className="text-right px-4 py-3 font-bold text-navy">الحالة</th>
                <th className="text-left px-4 py-3 font-bold text-navy">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.dairaName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.wilayaName}</td>
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
              {items.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">لا توجد بلديات</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-navy mb-4">{editing ? "تعديل بلدية" : "بلدية جديدة"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy mb-1">الدائرة *</label>
                <select required value={form.dairaId} onChange={(e) => setForm({ ...form, dairaId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold">
                  <option value="">اختر الدائرة</option>
                  {dairas.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.wilayaName})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-navy mb-1">اسم البلدية *</label>
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
