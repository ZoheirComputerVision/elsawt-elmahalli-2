import { prisma } from "@/lib/prisma";
import type { NewsFilter } from "@/features/news/types";

async function getNews(filter: NewsFilter = {}) {
  const where: Record<string, unknown> = {};
  if (filter.status) where.status = filter.status;
  if (filter.categoryId) where.categoryId = filter.categoryId;
  if (filter.regionId) where.regionId = filter.regionId;

  return prisma.news.findMany({
    where: where as never,
    include: { category: true, region: true, media: true },
    orderBy: { publishedAt: "desc" },
    take: filter.limit ?? 20,
    skip: filter.offset ?? 0,
  });
}

export async function getPublishedNews(limit = 20) {
  return getNews({ status: "published", limit });
}

export async function getNewsByCategory(categorySlug: string, limit = 10) {
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return [];
  return getNews({ status: "published", categoryId: category.id, limit });
}

export async function getNewsByRegion(regionSlug: string, limit = 10) {
  const region = await prisma.region.findUnique({ where: { slug: regionSlug } });
  if (!region) return [];
  return getNews({ status: "published", regionId: region.id, limit });
}

export async function getHeroNews() {
  const all = await getNews({ status: "published", limit: 5 });
  return { main: all[0] ?? null, secondary: all.slice(1, 4) };
}

export async function getLatestNews(limit = 12) {
  return getNews({ status: "published", limit });
}

export async function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getAllRegions() {
  return prisma.region.findMany({ orderBy: { name: "asc" } });
}
