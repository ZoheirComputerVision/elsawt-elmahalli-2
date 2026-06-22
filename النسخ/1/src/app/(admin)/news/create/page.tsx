export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import NewsForm from "@/components/news/NewsForm";

export default async function CreateNewsPage() {
  const [categories, regions] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.region.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-navy mb-6">إنشاء خبر جديد</h1>
      <NewsForm categories={categories} regions={regions} />
    </div>
  );
}
