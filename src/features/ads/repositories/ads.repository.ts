import { prisma } from "@/lib/prisma";
import type { AdFilter, AdWithIncludes } from "../types";

const defaultSelect = {
  id: true,
  title: true,
  content: true,
  imageUrl: true,
  linkUrl: true,
  position: true,
  status: true,
  startDate: true,
  endDate: true,
  clicks: true,
  createdAt: true,
  updatedAt: true,
} as const;

function buildWhere(filter: AdFilter) {
  const where: Record<string, unknown> = {};
  if (filter.position) where.position = filter.position;
  if (filter.status) where.status = filter.status;
  if (filter.search) {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { content: { contains: filter.search, mode: "insensitive" } },
    ];
  }
  const now = new Date();
  if (filter.active) {
    where.AND = [
      { startDate: { lte: now } },
      { OR: [{ endDate: null }, { endDate: { gte: now } }] },
    ];
  }
  return where;
}

export const adsRepository = {
  async findMany(filter: AdFilter = {}): Promise<AdWithIncludes[]> {
    return prisma.ad.findMany({
      select: defaultSelect,
      where: buildWhere(filter) as any,
      orderBy: { createdAt: "desc" },
      take: filter.limit ?? 100,
      skip: filter.offset ?? 0,
    }) as unknown as AdWithIncludes[];
  },

  async findById(id: string): Promise<AdWithIncludes | null> {
    return prisma.ad.findUnique({ where: { id }, select: defaultSelect }) as unknown as AdWithIncludes | null;
  },

  async count(filter: AdFilter = {}): Promise<number> {
    return prisma.ad.count({ where: buildWhere(filter) as any });
  },

  async create(data: Record<string, unknown>): Promise<AdWithIncludes> {
    return prisma.ad.create({ data: data as any, select: defaultSelect }) as unknown as AdWithIncludes;
  },

  async update(id: string, data: Record<string, unknown>): Promise<AdWithIncludes> {
    return prisma.ad.update({ where: { id }, data: data as any, select: defaultSelect }) as unknown as AdWithIncludes;
  },

  async delete(id: string): Promise<void> {
    await prisma.ad.delete({ where: { id } });
  },

  async incrementClicks(id: string): Promise<void> {
    await prisma.ad.update({ where: { id }, data: { clicks: { increment: 1 } } });
  },
};
