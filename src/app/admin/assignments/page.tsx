"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Assignment = {
  id: string; title: string; description: string | null; type: string; priority: string;
  status: string; dueDate: string | null; location: string | null;
  assignedBy: { id: string; name: string };
  assignedTo: { id: string; name: string; avatar: string | null };
  commune: { id: string; name: string; slug: string } | null;
  _count: { comments: number; attachments: number };
  createdAt: string;
};

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [reporters, setReporters] = useState<{ id: string; name: string }[]>([]);
  const [communes, setCommunes] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", type: "news", priority: "medium", assignedToId: "", communeId: "", dueDate: "", location: "" });

  const load = useCallback(async (statusFilter: string) => {
    const url = statusFilter ? `/api/assignments?status=${statusFilter}` : "/api/assignments";
    const [res, repRes, comRes] = await Promise.all([
      fetch(url), fetch("/api/users?role=REPORTER"), fetch("/api/geographic/communes"),
    ]);
    const [data, repData, comData] = await Promise.all([res.json(), repRes.json(), comRes.json()]);
    if (data.success) setAssignments(data.data);
    if (repData.success) setReporters(repData.data);
    if (comData.success) setCommunes(comData.data);
    setLoading(false);
  }, []);

  const mounted = useRef(false);
  useEffect(() => { if (!mounted.current) { mounted.current = true; load(filter); } }, [load, filter]);

  const create = async () => {
    const res = await fetch("/api/assignments", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) { setShowForm(false); setForm({ title: "", description: "", type: "news", priority: "medium", assignedToId: "", communeId: "", dueDate: "", location: "" }); load(filter); }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/assignments/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load(filter);
  };

  const badge = (s: string) => {
    const m: Record<string, string> = { pending: "bg-gray-100 text-gray-600", in_progress: "bg-blue-100 text-blue-600", review: "bg-amber-100 text-amber-600", completed: "bg-green-100 text-green-600", cancelled: "bg-red-100 text-red-600" };
    return m[s] ?? "bg-gray-100";
  };
  const prioBadge = (p: string) => {
    const m: Record<string, string> = { low: "text-gray-500", medium: "text-amber-600", high: "text-orange-600", urgent: "text-red-600 font-bold" };
    return m[p] ?? "";
  };

  if (loading) return <p className="text-sm text-muted-foreground">جاري التحميل...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-navy">إدارة المهام</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-navy text-white px-4 py-2 rounded-sm text-xs font-bold">
          {showForm ? "إلغاء" : "مهمة جديدة"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input placeholder="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
          <input placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs">
            <option value="news">خبر</option><option value="coverage">تغطية</option><option value="interview">مقابلة</option><option value="investigation">تحقيق</option>
          </select>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs">
            <option value="low">منخفضة</option><option value="medium">متوسطة</option><option value="high">عالية</option><option value="urgent">عاجلة</option>
          </select>
          <select value={form.assignedToId} onChange={(e) => setForm({ ...form, assignedToId: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs">
            <option value="">اختر المراسل</option>
            {reporters.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select value={form.communeId} onChange={(e) => setForm({ ...form, communeId: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs">
            <option value="">اختر البلدية</option>
            {communes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
          <input placeholder="الموقع" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
          <button onClick={create} className="bg-green-600 text-white px-4 py-2 rounded-sm text-xs font-bold">إنشاء</button>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {["", "pending", "in_progress", "review", "completed", "cancelled"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 rounded-sm text-[10px] font-bold border ${filter === s ? "bg-navy text-white border-navy" : "bg-white text-navy border-gray-200"}`}>
            {s ? { pending: "معلقة", in_progress: "قيد التنفيذ", review: "مراجعة", completed: "مكتملة", cancelled: "ملغية" }[s] : "الكل"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {assignments.map((a) => (
          <div key={a.id} className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-navy">{a.title}</h3>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${badge(a.status)}`}>{a.status}</span>
                  <span className={`text-[10px] ${prioBadge(a.priority)}`}>{a.priority}</span>
                </div>
                {a.description && <p className="text-xs text-muted-foreground mb-2">{a.description}</p>}
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span>من: {a.assignedBy.name}</span>
                  <span>إلى: {a.assignedTo.name}</span>
                  {a.commune && <span>البلدية: {a.commune.name}</span>}
                  {a.dueDate && <span>الموعد: {new Date(a.dueDate).toLocaleDateString("ar-SA")}</span>}
                  <span>تعليقات: {a._count.comments}</span>
                  <span>مرفقات: {a._count.attachments}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {a.status === "pending" && <StatusBtn onClick={() => updateStatus(a.id, "in_progress")} label="بدء" />}
                {a.status === "in_progress" && <StatusBtn onClick={() => updateStatus(a.id, "review")} label="مراجعة" />}
                {a.status === "review" && <StatusBtn onClick={() => updateStatus(a.id, "completed")} label="إكمال" />}
                {(a.status === "pending" || a.status === "in_progress") && <StatusBtn onClick={() => updateStatus(a.id, "cancelled")} label="إلغاء" danger />}
              </div>
            </div>
          </div>
        ))}
        {assignments.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">لا توجد مهام</p>}
      </div>
    </div>
  );
}

function StatusBtn({ onClick, label, danger }: { onClick: () => void; label: string; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`text-[10px] px-2 py-1 rounded-sm font-bold border ${danger ? "border-red-200 text-red-600 hover:bg-red-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}>
      {label}
    </button>
  );
}
