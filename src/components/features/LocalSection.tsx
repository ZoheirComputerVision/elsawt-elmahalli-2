"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "@/components/features/SectionHeader";
import type { NewsWithIncludes as News } from "@/features/news/types";

type RegionTab = "all" | "tiaret" | "tissemsilt" | "ksar-chellala";

const tabs: { key: RegionTab; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "tiaret", label: "تيارت" },
  { key: "tissemsilt", label: "تيسمسيلت" },
  { key: "ksar-chellala", label: "قصر الشلالة" },
];

function MainStory({ item }: { item: News }) {
  return (
    <div className="group cursor-pointer flex flex-col gap-2">
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm flex items-center justify-center text-gray-300 overflow-hidden">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div>
        <Badge className="bg-navy/10 text-navy text-[10px] rounded-sm px-1.5 py-0.5 font-semibold mb-1">
          {item.category?.name ?? "خبر"}
        </Badge>
        <h3 className="text-sm font-bold text-navy leading-snug group-hover:text-gold transition-colors line-clamp-2">{item.title}</h3>
        {item.summary && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-1">{item.summary}</p>}
      </div>
    </div>
  );
}

function SideStory({ item }: { item: News }) {
  return (
    <a href={`/news/${item.slug}`} className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0 group">
      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
      <span className="text-sm text-navy leading-snug group-hover:text-gold transition-colors line-clamp-2">{item.title}</span>
    </a>
  );
}

function RegionBlock({ region }: { region: { key: RegionTab; label: string; news: News[] } }) {
  const main = region.news[0];
  const side = region.news.slice(1, 5);
  if (!main) return null;

  return (
    <div className="border border-gray-200 bg-white rounded-sm overflow-hidden">
      <div className="bg-navy text-white px-3 py-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-gold rounded-full" />
        <span className="text-sm font-bold">{region.label}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
        <div className="lg:col-span-3">
          <MainStory item={main} />
        </div>
        <div className="lg:col-span-2 divide-y divide-gray-100">
          {side.map((item) => (
            <SideStory key={item.id} item={item} />
          ))}
        </div>
      </div>
      <a href="#" className="block text-center py-2 text-xs font-semibold text-gold hover:bg-gold/5 transition-colors border-t border-gray-100">
        المزيد من أخبار {region.label} ←
      </a>
    </div>
  );
}

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <SectionHeader title="محليات" href="/local" />
        <div className="flex items-center gap-1 bg-gray-100 rounded-sm p-0.5 self-start">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors ${
                activeTab === tab.key ? "bg-navy text-white shadow-sm" : "text-navy hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {visibleRegions.map((region) => (
          <RegionBlock key={region.key} region={region} />
        ))}
      </div>
    </section>
  );
}
