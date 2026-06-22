export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { newsService } from "@/features/news/services";
import NewsFilters from "@/components/news/NewsFilters";
import NewsTable from "@/components/news/NewsTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function NewsListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [categories, regions] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.region.findMany({ orderBy: { name: "asc" } }),
  ]);

  const news = await newsService.list({
    status: params.status as "draft" | "published" | "archived" | undefined,
    categoryId: params.categoryId,
    regionId: params.regionId,
    search: params.search,
    limit: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-navy">إدارة الأخبار</h1>
          <p className="text-sm text-muted-foreground mt-1">
            إجمالي {news.length} خبر
          </p>
        </div>
        <Link href="/news/create">
          <Button>خبر جديد</Button>
        </Link>
      </div>

      <NewsFilters categories={categories} regions={regions} />
      <NewsTable news={news} />
    </div>
  );
}
