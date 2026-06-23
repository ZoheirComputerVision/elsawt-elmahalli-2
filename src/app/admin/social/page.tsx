"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Trash2, CheckCircle, XCircle, Clock, Globe, MessageCircle } from "lucide-react";

interface AccountRow {
  id: string;
  platform: string;
  name: string;
  pageId: string | null;
  pageName: string | null;
  username: string | null;
  isActive: boolean;
  autoPost: boolean;
  _count: { posts: number };
}

interface PostRow {
  id: string;
  platform: string;
  status: string;
  message: string;
  postUrl: string | null;
  error: string | null;
  createdAt: string;
  postedAt: string | null;
  news: { id: string; title: string; slug: string } | null;
  account: { id: string; name: string; platform: string } | null;
  createdBy: { id: string; name: string } | null;
}

export default function SocialAdmin() {
  const [tab, setTab] = useState<"accounts" | "posts">("accounts");
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ platform: "facebook", name: "", pageId: "", pageName: "", username: "", accessToken: "", tokenExpiresAt: "", autoPost: false });

  const loadAccounts = useCallback(async () => {
    const res = await fetch("/api/social/accounts");
    const json = await res.json();
    if (json.success) setAccounts(json.data);
  }, []);

  const loadPosts = useCallback(async () => {
    const res = await fetch("/api/social/posts");
    const json = await res.json();
    if (json.success) setPosts(json.data);
  }, []);

  const load = useCallback(async () => {
    await Promise.all([loadAccounts(), loadPosts()]);
    setLoading(false);
  }, [loadAccounts, loadPosts]);

  const mounted = useRef(false);
  useEffect(() => { if (!mounted.current) { mounted.current = true; load(); } }, [load]);

  const createAccount = async () => {
    setError("");
    const res = await fetch("/api/social/accounts", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tokenExpiresAt: form.tokenExpiresAt || null }),
    });
    const json = await res.json();
    if (json.success) { setShowForm(false); setForm({ platform: "facebook", name: "", pageId: "", pageName: "", username: "", accessToken: "", tokenExpiresAt: "", autoPost: false }); loadAccounts(); }
    else setError(json.error || "فشل الإضافة");
  };

  const toggleAutoPost = async (id: string, current: boolean) => {
    await fetch(`/api/social/accounts/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ autoPost: !current }),
    });
    loadAccounts();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/social/accounts/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    loadAccounts();
  };

  const removeAccount = async (id: string) => {
    await fetch(`/api/social/accounts/${id}`, { method: "DELETE" });
    loadAccounts();
  };

  const statusIcon = (s: string) => {
    if (s === "posted") return <CheckCircle className="w-3 h-3 text-green-600" />;
    if (s === "failed") return <XCircle className="w-3 h-3 text-red-600" />;
    return <Clock className="w-3 h-3 text-amber-600" />;
  };

  if (loading) return <p className="text-sm text-muted-foreground">جاري التحميل...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-navy">التواصل الاجتماعي</h1>
        <div className="flex gap-2">
          <button onClick={() => { setTab("accounts"); }} className={`px-3 py-1 rounded-sm text-xs font-bold border ${tab === "accounts" ? "bg-navy text-white border-navy" : "bg-white text-navy border-gray-200"}`}>الحسابات</button>
          <button onClick={() => { setTab("posts"); }} className={`px-3 py-1 rounded-sm text-xs font-bold border ${tab === "posts" ? "bg-navy text-white border-navy" : "bg-white text-navy border-gray-200"}`}>سجل النشر</button>
        </div>
      </div>

      {tab === "accounts" && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 bg-navy text-white px-4 py-2 rounded-sm text-xs font-bold">
              <Plus className="w-3 h-3" /> {showForm ? "إلغاء" : "حساب جديد"}
            </button>
          </div>

          {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

          {showForm && (
            <div className="bg-white border border-gray-200 rounded-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs">
                <option value="facebook">فيسبوك</option><option value="twitter">تويتر</option>
              </select>
              <input placeholder="اسم الحساب" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
              {form.platform === "facebook" && (
                <input placeholder="Page ID" value={form.pageId} onChange={(e) => setForm({ ...form, pageId: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
              )}
              {form.platform === "facebook" && (
                <input placeholder="Page Name" value={form.pageName} onChange={(e) => setForm({ ...form, pageName: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
              )}
              {form.platform === "twitter" && (
                <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
              )}
              <input placeholder="Access Token" value={form.accessToken} onChange={(e) => setForm({ ...form, accessToken: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs font-mono" />
              <input type="datetime-local" placeholder="انتهاء التوكن" value={form.tokenExpiresAt} onChange={(e) => setForm({ ...form, tokenExpiresAt: e.target.value })} className="border border-gray-200 rounded-sm px-3 py-2 text-xs" />
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={form.autoPost} onChange={(e) => setForm({ ...form, autoPost: e.target.checked })} />
                نشر تلقائي
              </label>
              <button onClick={createAccount} className="bg-green-600 text-white px-4 py-2 rounded-sm text-xs font-bold">إضافة</button>
            </div>
          )}

          <div className="space-y-3">
            {accounts.map((a) => (
              <div key={a.id} className={`bg-white border rounded-sm p-4 ${a.isActive ? "border-gray-200" : "border-gray-100 opacity-60"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {a.platform === "facebook" ? <Globe className="w-3 h-3 text-blue-600" /> : <MessageCircle className="w-3 h-3 text-sky-500" />}
                      <h3 className="text-sm font-bold text-navy">{a.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${a.autoPost ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                        {a.autoPost ? "تلقائي" : "يدوي"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>{a.platform === "facebook" ? `صفحة: ${a.pageName ?? a.pageId ?? "—"}` : `@${a.username ?? "—"}`}</span>
                      <span>{a.isActive ? "نشط" : "موقف"}</span>
                      <span>{a._count.posts} منشور</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggleAutoPost(a.id, a.autoPost)} className={`text-[10px] px-2 py-1 rounded-sm font-bold border ${a.autoPost ? "border-gray-200 text-gray-600" : "border-green-200 text-green-600"}`}>
                      {a.autoPost ? "إيقاف التلقائي" : "تفعيل التلقائي"}
                    </button>
                    <button onClick={() => toggleActive(a.id, a.isActive)} className={`text-[10px] px-2 py-1 rounded-sm font-bold border ${a.isActive ? "border-amber-200 text-amber-600" : "border-green-200 text-green-600"}`}>
                      {a.isActive ? "إيقاف" : "تفعيل"}
                    </button>
                    <button onClick={() => removeAccount(a.id)} className="text-[10px] px-2 py-1 rounded-sm font-bold border border-red-200 text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {accounts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">لا توجد حسابات تواصل</p>}
          </div>
        </>
      )}

      {tab === "posts" && (
        <div className="space-y-2">
          {posts.map((p) => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0">{statusIcon(p.status)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
                    <span>{p.platform === "facebook" ? <Globe className="w-3 h-3 inline" /> : <MessageCircle className="w-3 h-3 inline" />} {p.account?.name}</span>
                    <span>بواسطة: {p.createdBy?.name}</span>
                    <span>{new Date(p.createdAt).toLocaleString("ar-SA")}</span>
                  </div>
                  <p className="text-xs text-navy truncate">{p.message}</p>
                  {p.postUrl && <a href={p.postUrl} target="_blank" className="text-[10px] text-gold hover:underline">عرض المنشور</a>}
                  {p.error && <p className="text-[10px] text-red-600 mt-1">خطأ: {p.error}</p>}
                  {p.news && <a href={`/news/${p.news.slug}`} className="text-[10px] text-gold hover:underline">← {p.news.title}</a>}
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">لا توجد منشورات بعد</p>}
        </div>
      )}
    </div>
  );
}
