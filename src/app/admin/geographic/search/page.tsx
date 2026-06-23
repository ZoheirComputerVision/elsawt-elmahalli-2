"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type GeoResult = {
  type: string;
  result?: any;
  wilayas?: any[];
  dairas?: any[];
  communes?: any[];
  reporters?: any[];
  q?: string;
};

export default function GeographicSearchPage() {
  const [wilaya, setWilaya] = useState("");
  const [daira, setDaira] = useState("");
  const [commune, setCommune] = useState("");
  const [q, setQ] = useState("");
  const [result, setResult] = useState<GeoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async (params: Record<string, string>) => {
    setLoading(true);
    setError("");
    try {
      const url = new URL("/api/geographic/search", window.location.origin);
      Object.entries(params).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });
      const res = await fetch(url.toString());
      const data = await res.json();
      if (!data.success) { setError(data.error); setResult(null); }
      else setResult(data.data);
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    search({});
  }, [search]);

  return (
    <div>
      <h1 className="text-xl font-bold text-navy mb-6">البحث الجغرافي</h1>

      <div className="bg-white border border-gray-200 rounded-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="text-[10px] font-bold text-navy block mb-1">ولاية</label>
            <input
              value={wilaya}
              onChange={(e) => { setWilaya(e.target.value); setDaira(""); setCommune(""); }}
              placeholder="اسم الولاية..."
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-navy block mb-1">دائرة</label>
            <input
              value={daira}
              onChange={(e) => { setDaira(e.target.value); setCommune(""); }}
              placeholder="اسم الدائرة..."
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-navy block mb-1">بلدية</label>
            <input
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              placeholder="اسم البلدية..."
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-navy block mb-1">بحث نصي</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="كلمة بحث..."
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-xs"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => search({ wilaya, daira, commune, q })}
            disabled={loading}
            className="bg-navy text-white px-4 py-2 rounded-sm text-xs font-bold hover:bg-navy/80 disabled:opacity-50"
          >
            {loading ? "جاري البحث..." : "بحث"}
          </button>
          <button
            onClick={() => { setWilaya(""); setDaira(""); setCommune(""); setQ(""); search({}); }}
            className="border border-gray-200 px-4 py-2 rounded-sm text-xs hover:bg-gray-50"
          >
            إعادة تعيين
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      {result && (
        <div className="space-y-4">
          {result.type === "wilaya" && result.result && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-bold text-navy mb-2">{result.result.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {result.result.dairas?.map((d: any) => (
                  <button
                    key={d.id}
                    onClick={() => { setWilaya(result.result.slug); setDaira(d.slug); search({ wilaya: result.result.slug, daira: d.slug }); }}
                    className="border border-gray-200 rounded-sm p-2 text-xs text-right hover:bg-gray-50"
                  >
                    <p className="font-bold">{d.name}</p>
                    <p className="text-[10px] text-muted-foreground">{d._count?.communes ?? 0} بلديات</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {result.type === "daira" && result.result && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-bold text-navy mb-1">{result.result.name}</h2>
              <p className="text-[10px] text-muted-foreground mb-3">{result.result.wilaya.name}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {result.result.communes?.map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => { setWilaya(result.result.wilaya.slug); setDaira(result.result.slug); setCommune(c.slug); search({ commune: c.slug }); }}
                    className="border border-gray-200 rounded-sm p-2 text-xs text-right hover:bg-gray-50"
                  >
                    <p className="font-bold">{c.name}</p>
                    <p className="text-[10px]">{c._count.news} أخبار | {c._count.reporters} مراسلين</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {result.type === "commune" && result.result && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-bold text-navy mb-1">{result.result.name}</h2>
              <p className="text-[10px] text-muted-foreground">{result.result.daira.wilaya.name} &gt; {result.result.daira.name}</p>
            </div>
          )}

          {result.type === "search" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SearchSection title="الولايات" items={result.wilayas ?? []} slugKey="slug" />
              <SearchSection title="الدوائر" items={(result.dairas ?? []).map((d: any) => ({ ...d, parent: d.wilaya?.name }))} slugKey="slug" />
              <SearchSection title="البلديات" items={(result.communes ?? []).map((c: any) => ({ ...c, parent: `${c.daira?.wilaya?.name} > ${c.daira?.name}` }))} slugKey="slug" />
              <SearchSection title="المراسلين" items={(result.reporters ?? []).map((r: any) => ({ name: r.name, parent: r.commune?.name ? `${r.commune.daira.wilaya.name} > ${r.commune.name}` : null }))} noLink />
            </div>
          )}

          {result.type === "index" && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-bold text-navy mb-3">جميع الولايات</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {result.wilayas?.map((w: any) => (
                  <button
                    key={w.id}
                    onClick={() => { setWilaya(w.slug); search({ wilaya: w.slug }); }}
                    className="border border-gray-200 rounded-sm p-3 text-xs text-right hover:bg-gray-50"
                  >
                    <p className="font-bold">{w.name}</p>
                    <p className="text-[10px] text-muted-foreground">{w._count?.dairas ?? 0} دوائر</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchSection({ title, items, slugKey, noLink }: { title: string; items: any[]; slugKey?: string; noLink?: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      <div className="bg-navy text-white px-3 py-2">
        <h3 className="text-xs font-bold">{title} ({items.length})</h3>
      </div>
      <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
        {items.length === 0 && <p className="text-[10px] text-muted-foreground p-2">لا يوجد</p>}
        {items.map((item: any, i: number) => (
          <div key={item.id ?? i} className="text-xs p-2 border-b border-gray-50 last:border-0">
            <p className="font-bold">{item.name}</p>
            {item.parent && <p className="text-[9px] text-muted-foreground">{item.parent}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
