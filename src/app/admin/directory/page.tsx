"use client";

import { useState, useEffect, useCallback } from "react";

interface DirectoryItem {
  id: string;
  name: string;
  category: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  status: string;
  featured: boolean;
  contactName: string | null;
  createdAt: string;
}

const CATEGORIES = [
  "مطاعم ومقاهي",
  "محلات تجارية",
  "خدمات صحية",
  "خدمات تعليمية",
  "مقاولات وبناء",
  "نقل وسفر",
  "عقارات",
  "صناعة",
  "زراعة",
  "أخرى",
];

export default function AdminDirectoryPage() {
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DirectoryItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    province: "",
    status: "active",
    featured: false,
    contactName: "",
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      const res = await fetch(`/api/directory?${params}`);
      const json = await res.json();
      if (json.success) setItems(json.data ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [search, category]);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setForm({ name: "", category: "", description: "", phone: "", email: "", website: "", address: "", city: "", province: "", status: "active", featured: false, contactName: "" });
    setEditing(null);
  }

  function openEdit(item: DirectoryItem) {
    setForm({
      name: item.name,
      category: item.category,
      description: item.description ?? "",
      phone: item.phone ?? "",
      email: item.email ?? "",
      website: item.website ?? "",
      address: item.address ?? "",
      city: item.city ?? "",
      province: item.province ?? "",
      status: item.status,
      featured: item.featured,
      contactName: item.contactName ?? "",
    });
    setEditing(item);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/directory/${editing.id}` : "/api/directory";
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
      const res = await fetch(`/api/directory/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) load();
      else alert(json.error || "فشل الحذف");
    } catch { alert("فشل الاتصال بالخادم"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">الدليل الاقتصادي</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} قيد</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-gold hover:bg-gold-light text-navy text-sm font-bold px-4 py-2 rounded-lg transition-colors">
          + قيد جديد
        </button>
      </div>

      <div className="flex gap-3">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold">
          <option value="">كل التصنيفات</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading && <div className="text-center py-10"><div className="inline-block w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>}

      {!loading && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-right px-4 py-3 font-bold text-navy">الاسم</th>
                <th className="text-right px-4 py-3 font-bold text-navy">التصنيف</th>
                <th className="text-right px-4 py-3 font-bold text-navy">المدينة</th>
                <th className="text-right px-4 py-3 font-bold text-navy">الحالة</th>
                <th className="text-left px-4 py-3 font-bold text-navy">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-navy">{item.name} {item.featured && <span className="text-[10px] bg-gold/20 text-gold px-1.5 py-0.5 rounded-full mr-1">مميز</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.city || "---"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {item.status === "active" ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <button onClick={() => openEdit(item)} className="text-gold hover:text-navy text-xs font-semibold transition-colors mr-2">تعديل</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors">حذف</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">لا توجد قيود</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-navy mb-4">{editing ? "تعديل قيد" : "قيد جديد"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">الاسم *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">التصنيف *</label>
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold">
                    <option value="">اختر التصنيف</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-navy mb-1">الوصف</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">الهاتف</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">البريد الإلكتروني</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">الموقع الإلكتروني</label>
                  <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">جهة الاتصال</label>
                  <input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">العنوان</label>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">المدينة</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">الولاية</label>
                  <input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-gold" />
                  <span className="text-xs font-bold text-navy">مميز</span>
                </label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold">
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
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
