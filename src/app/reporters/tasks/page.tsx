"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Assignment = {
  id: string; title: string; description: string | null; type: string; priority: string;
  status: string; dueDate: string | null; location: string | null;
  assignedBy: { id: string; name: string };
  commune: { id: string; name: string; slug: string } | null;
  _count: { comments: number; attachments: number };
  createdAt: string;
};

type CommentRow = { id: string; content: string; createdAt: string; user: { id: string; name: string; avatar: string | null } };

export default function ReporterTasksPage() {
  const [tasks, setTasks] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [newComment, setNewComment] = useState("");

  const load = useCallback(async (statusFilter: string) => {
    const url = statusFilter ? `/api/assignments?status=${statusFilter}` : "/api/assignments";
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) setTasks(data.data);
    setLoading(false);
  }, []);

  const mounted = useRef(false);
  useEffect(() => { if (!mounted.current) { mounted.current = true; load(filter); } }, [load, filter]);

  const loadTask = async (id: string) => {
    const isNew = id !== selectedTask;
    setSelectedTask(isNew ? id : null);
    if (isNew) {
      const res = await fetch(`/api/assignments/${id}`);
      const data = await res.json();
      if (data.success) setComments(data.data.comments ?? []);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/assignments/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load(filter);
  };

  const addComment = async (assignmentId: string) => {
    if (!newComment.trim()) return;
    await fetch(`/api/assignments/${assignmentId}/comments`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment }),
    });
    setNewComment("");
    loadTask(assignmentId);
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
      <h1 className="text-xl font-bold text-navy mb-6">مهامي</h1>

      <div className="flex gap-2 mb-4">
        {["", "pending", "in_progress", "review", "completed"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 rounded-sm text-[10px] font-bold border ${filter === s ? "bg-navy text-white border-navy" : "bg-white text-navy border-gray-200"}`}>
            {s ? { pending: "معلقة", in_progress: "قيد التنفيذ", review: "مراجعة", completed: "مكتملة" }[s] : "الكل"}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} className="bg-white border border-gray-200 rounded-sm">
            <button onClick={() => loadTask(t.id)} className="w-full text-right p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-navy">{t.title}</h3>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${badge(t.status)}`}>{t.status}</span>
                  <span className={`text-[10px] ${prioBadge(t.priority)}`}>{t.priority}</span>
                </div>
                <div className="flex gap-1">
                  {t.status === "pending" && <span className="text-[10px] text-muted-foreground" onClick={(e) => { e.stopPropagation(); updateStatus(t.id, "in_progress"); }}>▶ بدء</span>}
                  {t.status === "in_progress" && <span className="text-[10px] text-amber-600" onClick={(e) => { e.stopPropagation(); updateStatus(t.id, "review"); }}>⏎ طلب مراجعة</span>}
                </div>
              </div>
              {t.description && <p className="text-xs text-muted-foreground mt-1">{t.description}</p>}
              <div className="flex gap-3 text-[10px] text-muted-foreground mt-2">
                <span>من: {t.assignedBy.name}</span>
                {t.commune && <span>{t.commune.name}</span>}
                {t.dueDate && <span>الموعد: {new Date(t.dueDate).toLocaleDateString("ar-SA")}</span>}
                <span>{t._count.comments} تعليق</span>
              </div>
            </button>

            {selectedTask === t.id && (
              <div className="border-t border-gray-100 px-4 py-3">
                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                  {comments.map((c: CommentRow) => (
                    <div key={c.id} className="text-xs border-b border-gray-50 pb-2">
                      <span className="font-bold text-navy">{c.user.name}</span>
                      <span className="text-[9px] text-muted-foreground mr-2">{new Date(c.createdAt).toLocaleString("ar-SA")}</span>
                      <p className="mt-1">{c.content}</p>
                    </div>
                  ))}
                  {comments.length === 0 && <p className="text-[10px] text-muted-foreground">لا توجد تعليقات</p>}
                </div>
                <div className="flex gap-2">
                  <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="أضف تعليقاً..." className="flex-1 border border-gray-200 rounded-sm px-3 py-2 text-xs" />
                  <button onClick={() => addComment(t.id)} className="bg-navy text-white px-3 py-2 rounded-sm text-xs font-bold">إرسال</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {tasks.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">لا توجد مهام</p>}
      </div>
    </div>
  );
}
