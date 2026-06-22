"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { NewsWithIncludes as News } from "@/features/news/types";

type RegionTab = "all" | "tiaret" | "tissemsilt" | "ksar-chellala";

const tabs: { key: RegionTab; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "tiaret", label: "تيارت" },
  { key: "tissemsilt", label: "تيسمسيلت" },
  { key: "ksar-chellala", label: "قصر الشلالة" },
];

export default function LocalSection({
  tiaretNews = [],
  tissemsiltNews = [],
  ksarNews = [],
}: {
  tiaretNews?: News[];
  tissemsiltNews?: News[];
  ksarNews?: News[];
}) {
  const [activeTab, setActiveTab] = useState<RegionTab>("all");

  const regions: { key: RegionTab; label: string; news: News[] }[] = [
    { key: "tiaret", label: "تيارت", news: tiaretNews },
    { key: "tissemsilt", label: "تيسمسيلت", news: tissemsiltNews },
    { key: "ksar-chellala", label: "قصر الشلالة", news: ksarNews },
  ];

  const visibleRegions = activeTab === "all" ? regions : regions.filter((r) => r.key === activeTab);

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-xl font-bold text-navy flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-gold inline-block" />
          محليات
        </h2>
        <div className="flex items-center gap-1 bg-gray-100 rounded-sm p-0.5 self-start">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                activeTab === tab.key ? "bg-navy text-white shadow-sm" : "text-navy hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {visibleRegions.map((region) => (
          <div key={region.key} className="border border-gray-200 bg-white rounded-sm overflow-hidden">
            <div className="bg-navy text-white px-4 py-2.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gold rounded-full" />
              <span className="text-sm font-bold">{region.label}</span>
              <span className="text-[10px] text-gold/60 mr-auto">{region.news.length} خبر</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              <div className="lg:col-span-2 p-4 lg:pl-0 lg:border-l border-gray-100">
                {region.news[0] ? (
                  <div className="group cursor-pointer flex flex-col sm:flex-row gap-4">
                    <div className="sm:w-48 h-32 shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm flex items-center justify-center text-gray-300 overflow-hidden">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge className="bg-red-accent text-white text-[10px] rounded-sm px-1.5 py-0.5 h-4">
                          {region.news[0].category?.name ?? "خبر"}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {region.news[0].publishedAt?.toLocaleDateString("ar-SA") ?? ""}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-navy leading-snug group-hover:text-gold transition-colors mb-1.5">
                        {region.news[0].title}
                      </h3>
                      {region.news[0].summary && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{region.news[0].summary}</p>
                      )}
                      <span className="inline-block mt-2 text-xs text-gold font-semibold group-hover:text-navy transition-colors">
                        قراءة المزيد ←
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground text-xs">
                    لا توجد أخبار في هذه المنطقة
                  </div>
                )}
              </div>

              <div className="p-4 space-y-0">
                {region.news.slice(1, 5).map((item, i) => (
                  <a
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className={`flex items-start gap-2.5 py-2.5 group ${
                      i < Math.min(region.news.length - 1, 4) - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-navy/5 text-navy text-[11px] font-bold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-navy transition-colors">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-navy leading-snug group-hover:text-gold transition-colors">
                      {item.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <a
              href={`/${region.key === "ksar-chellala" ? "ksar-chellala" : region.key}`}
              className="block text-center py-2 text-xs font-semibold text-gold hover:bg-gold/5 transition-colors border-t border-gray-100"
            >
              المزيد من أخبار {region.label} ←
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
