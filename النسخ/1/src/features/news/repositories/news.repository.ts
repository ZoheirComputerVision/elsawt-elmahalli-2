import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { NewsFilter, NewsWithIncludes } from "../types";

const include = {
  category: true,
  region: true,
  media: true,
  tags: { include: { tag: true } },
} as const;

export const newsRepository = {
  async findMany(filter: NewsFilter = {}): Promise<NewsWithIncludes[]> {
    const where: Prisma.NewsWhereInput = {};

    if (filter.status) where.status = filter.status;
    if (filter.categoryId) where.categoryId = filter.categoryId;
    if (filter.regionId) where.regionId = filter.regionId;
    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: "insensitive" } },
        { summary: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    return prisma.news.findMany({
      where,
      include,
      orderBy: { publishedAt: "desc" },
      take: filter.limit ?? 50,
      skip: filter.offset ?? 0,
    }) as unknown as NewsWithIncludes[];
  },

  async findById(id: string): Promise<NewsWithIncludes | null> {
    return prisma.news.findUnique({
      where: { id },
      include,
    }) as unknown as NewsWithIncludes | null;
  },

  async findBySlug(slug: string): Promise<NewsWithIncludes | null> {
    return prisma.news.findUnique({
      where: { slug },
      include,
    }) as unknown as NewsWithIncludes | null;
  },

  async create(data: Prisma.NewsCreateInput): Promise<NewsWithIncludes> {
    return prisma.news.create({ data, include }) as unknown as NewsWithIncludes;
  },

  async update(id: string, data: Prisma.NewsUpdateInput): Promise<NewsWithIncludes> {
    return prisma.news.update({ where: { id }, data, include }) as unknown as NewsWithIncludes;
  },

  async delete(id: string): Promise<void> {
    await prisma.news.delete({ where: { id } });
  },

  async count(filter: NewsFilter = {}): Promise<number> {
    const where: Prisma.NewsWhereInput = {};
    if (filter.status) where.status = filter.status;
    if (filter.categoryId) where.categoryId = filter.categoryId;
    if (filter.regionId) where.regionId = filter.regionId;
    return prisma.news.count({ where });
  },

  async incrementViews(id: string) {
    return prisma.news.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  },
};
