export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { newsService } from "@/features/news/services";
import NewsForm from "@/components/news/NewsForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditNewsPage({ params }: PageProps) {
  const { slug } = await params;
  const [news, categories, regions] = await Promise.all([
    newsService.getBySlug(slug),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.region.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!news) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-navy mb-6">تعديل الخبر</h1>
      <NewsForm initialData={news} categories={categories} regions={regions} />
    </div>
  );
}
