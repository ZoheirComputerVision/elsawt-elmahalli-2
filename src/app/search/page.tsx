"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  publishedAt: string;
  category: { name: string; slug: string } | null;
  tags: { tag: { name: string; slug: string } }[];
  region: { name: string; slug: string } | null;
}

interface SearchMeta {
  count: number;
  page: number;
  limit: number;
  pages: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [meta, setMeta] = useState<SearchMeta | null>(null);
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async (q: string, page = 1) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/news/search?q=${encodeURIComponent(q)}&page=${page}`);
      const json = await res.json();
      if (json.success) {
        setResults(json.data ?? []);
        setMeta(json.meta ?? null);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) doSearch(query);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) { setQuery(q); doSearch(q); }
  }, [doSearch]);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في الأخبار..."
              className="w-full px-5 py-3.5 pr-12 text-base border border-gray-200 rounded-full focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              dir="auto"
            />
            <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gold transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>
        </form>

        {query && !loading && (
          <p className="text-sm text-muted-foreground text-center mb-6">
            {meta ? `تم العثور على ${meta.count} نتيجة لـ "${query}"` : "جارِ البحث..."}
          </p>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              {results.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="group flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-navy group-hover:text-gold transition-colors line-clamp-2">{item.title}</h3>
                    {item.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.summary}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      {item.category && <span className="text-[10px] font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded">{item.category.name}</span>}
                      {item.region && <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{item.region.name}</span>}
                      <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true, locale: ar })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {meta && meta.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8" dir="ltr">
                {Array.from({ length: meta.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => doSearch(query, p)}
                    className={`w-9 h-9 text-sm rounded-lg border transition-colors ${
                      p === meta.page
                        ? "bg-gold text-navy border-gold font-bold"
                        : "border-gray-200 text-gray-600 hover:border-gold hover:text-gold"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {!loading && query && results.length === 0 && meta && (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">لا توجد نتائج لـ "{query}"</p>
            <p className="text-sm text-muted-foreground mt-1">حاول استخدام كلمات أخرى</p>
          </div>
        )}
      </div>
    </main>
  );
}
