"use client";

import { useState, useEffect, useCallback } from "react";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<MediaItem | null>(null);

  const load = useCallback(async (q = "") => {
    try {
      const url = q ? `/api/media?search=${encodeURIComponent(q)}` : "/api/media";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setItems(json.data ?? []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const timer = setTimeout(() => load(search), 300);
    return () => clearTimeout(timer);
  }, [search, load]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const json = await res.json();
      if (json.success) {
        load(search);
      } else {
        alert(json.error || "فشل الرفع");
      }
    } catch {
      alert("فشل الاتصال بالخادم");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الملف؟")) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((m) => m.id !== id));
        if (preview?.id === id) setPreview(null);
      } else {
        alert(json.error || "فشل الحذف");
      }
    } catch {
      alert("فشل الاتصال بالخادم");
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">مكتبة الوسائط</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} ملف</p>
        </div>
        <label className="bg-gold hover:bg-gold-light text-navy text-sm font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer">
          {uploading ? "جاري الرفع..." : "رفع ملف"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="بحث في الوسائط..."
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:border-gold/50 transition-all"
          >
            <button
              onClick={() => setPreview(item)}
              className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {item.mimeType.startsWith("image/") ? (
                <img src={item.url} alt={item.originalName} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </button>
            <div className="p-2">
              <p className="text-xs truncate text-navy" title={item.originalName}>{item.originalName}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{formatSize(item.size)}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <button
                  onClick={() => copyUrl(item.url)}
                  className="text-[10px] text-gold hover:text-navy transition-colors font-semibold"
                >
                  نسخ الرابط
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-[10px] text-red-500 hover:text-red-700 transition-colors font-semibold mr-auto"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
            لا توجد وسائط. ارفع أول ملف الآن.
          </div>
        )}
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <img src={preview.url} alt={preview.originalName} className="w-full rounded-sm" />
            </div>
            <div className="px-4 pb-4 space-y-1">
              <p className="text-sm font-bold text-navy">{preview.originalName}</p>
              <p className="text-xs text-muted-foreground">{formatSize(preview.size)} — {preview.mimeType}</p>
              <div className="flex items-center gap-1">
                <input
                  readOnly
                  value={`${window.location.origin}${preview.url}`}
                  className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={() => copyUrl(preview.url)}
                  className="text-xs text-gold hover:text-navy font-semibold shrink-0"
                >
                  نسخ
                </button>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="w-full mt-2 py-2 border border-gray-200 rounded-lg text-sm text-muted-foreground hover:bg-gray-50 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
