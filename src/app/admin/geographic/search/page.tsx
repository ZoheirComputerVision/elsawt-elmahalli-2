"use client";

import { useState, useEffect, useCallback } from "react";

type WilayaItem = { id: string; name: string; slug: string; _count?: { dairas: number }; dairas?: DairaItem[] };
type DairaItem = { id: string; name: string; slug: string; wilaya?: { name: string; slug: string }; communes?: CommuneItem[]; _count?: { communes: number } };
type CommuneItem = { id: string; name: string; slug: string; daira?: { name: string; wilaya: { name: string } }; _count?: { news: number; reporters: number } };
type ReporterItem = { id: string; name: string; commune?: { name: string; daira: { name: string; wilaya: { name: string } } } | null };

type GeoResult = {
  type: string;
  result?: WilayaItem | DairaItem | CommuneItem;
  wilayas?: WilayaItem[];
  dairas?: DairaItem[];
  communes?: CommuneItem[];
  reporters?: ReporterItem[];
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
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const load = async () => { await search({}); };
    load();
  }, [search]);

  function selectWilaya(slug: string) { setWilaya(slug); setDaira(""); setCommune(""); search({ wilaya: slug }); }
  function selectDaira(wilayaSlug: string, dairaSlug: string) { setWilaya(wilayaSlug); setDaira(dairaSlug); setCommune(""); search({ wilaya: wilayaSlug, daira: dairaSlug }); }
  function selectCommune(wilayaSlug: string, dairaSlug: string, communeSlug: string) { setWilaya(wilayaSlug); setDaira(dairaSlug); setCommune(communeSlug); search({ commune: communeSlug }); }

  const handleSearch = () => search({ wilaya, daira, commune, q });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r: any = result?.result;

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
            onClick={handleSearch}
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
          {result.type === "wilaya" && r && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-bold text-navy mb-2">{r.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(r.dairas ?? []).map((d: DairaItem) => (
                  <button
                    key={d.id}
                    onClick={() => selectDaira(r.slug, d.slug)}
                    className="border border-gray-200 rounded-sm p-2 text-xs text-right hover:bg-gray-50"
                  >
                    <p className="font-bold">{d.name}</p>
                    <p className="text-[10px] text-muted-foreground">{d._count?.communes ?? 0} بلديات</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {result.type === "daira" && r && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-bold text-navy mb-1">{r.name}</h2>
              <p className="text-[10px] text-muted-foreground mb-3">{r.wilaya?.name}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {(r.communes ?? []).map((c: CommuneItem) => (
                  <button
                    key={c.id}
                    onClick={() => selectCommune(r.wilaya?.slug ?? "", r.slug, c.slug)}
                    className="border border-gray-200 rounded-sm p-2 text-xs text-right hover:bg-gray-50"
                  >
                    <p className="font-bold">{c.name}</p>
                    <p className="text-[10px]">{c._count?.news ?? 0} أخبار | {c._count?.reporters ?? 0} مراسلين</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {result.type === "commune" && r && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-bold text-navy mb-1">{r.name}</h2>
              <p className="text-[10px] text-muted-foreground">{r.daira?.wilaya?.name} &gt; {r.daira?.name}</p>
            </div>
          )}

          {result.type === "search" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="bg-navy text-white px-3 py-2">
                  <h3 className="text-xs font-bold">الولايات ({(result.wilayas ?? []).length})</h3>
                </div>
                <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                  {(result.wilayas ?? []).length === 0 && <p className="text-[10px] text-muted-foreground p-2">لا يوجد</p>}
                  {(result.wilayas ?? []).map((w: WilayaItem) => (
                    <div key={w.id} className="text-xs p-2 border-b border-gray-50 last:border-0">
                      <p className="font-bold">{w.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="bg-navy text-white px-3 py-2">
                  <h3 className="text-xs font-bold">الدوائر ({(result.dairas ?? []).length})</h3>
                </div>
                <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                  {(result.dairas ?? []).length === 0 && <p className="text-[10px] text-muted-foreground p-2">لا يوجد</p>}
                  {(result.dairas ?? []).map((d: DairaItem) => (
                    <div key={d.id} className="text-xs p-2 border-b border-gray-50 last:border-0">
                      <p className="font-bold">{d.name}</p>
                      <p className="text-[9px] text-muted-foreground">{d.wilaya?.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="bg-navy text-white px-3 py-2">
                  <h3 className="text-xs font-bold">البلديات ({(result.communes ?? []).length})</h3>
                </div>
                <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                  {(result.communes ?? []).length === 0 && <p className="text-[10px] text-muted-foreground p-2">لا يوجد</p>}
                  {(result.communes ?? []).map((c: CommuneItem) => (
                    <div key={c.id} className="text-xs p-2 border-b border-gray-50 last:border-0">
                      <p className="font-bold">{c.name}</p>
                      <p className="text-[9px] text-muted-foreground">{c.daira?.wilaya?.name} &gt; {c.daira?.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-sm">
                <div className="bg-navy text-white px-3 py-2">
                  <h3 className="text-xs font-bold">المراسلين ({(result.reporters ?? []).length})</h3>
                </div>
                <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                  {(result.reporters ?? []).length === 0 && <p className="text-[10px] text-muted-foreground p-2">لا يوجد</p>}
                  {(result.reporters ?? []).map((rep: ReporterItem) => (
                    <div key={rep.id} className="text-xs p-2 border-b border-gray-50 last:border-0">
                      <p className="font-bold">{rep.name}</p>
                      {rep.commune && <p className="text-[9px] text-muted-foreground">{rep.commune.daira.wilaya.name} &gt; {rep.commune.name}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result.type === "index" && (
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h2 className="text-sm font-bold text-navy mb-3">جميع الولايات</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {(result.wilayas ?? []).map((w: WilayaItem) => (
                  <button
                    key={w.id}
                    onClick={() => selectWilaya(w.slug)}
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
