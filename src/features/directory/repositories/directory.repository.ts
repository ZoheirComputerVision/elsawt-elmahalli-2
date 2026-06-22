import { prisma } from "@/lib/prisma";
import type { DirectoryFilter, DirectoryEntryWithIncludes } from "../types";

const defaultSelect = {
  id: true,
  name: true,
  category: true,
  description: true,
  phone: true,
  email: true,
  website: true,
  address: true,
  city: true,
  province: true,
  imageUrl: true,
  status: true,
  featured: true,
  contactName: true,
  createdAt: true,
  updatedAt: true,
} as const;

function buildWhere(filter: DirectoryFilter) {
  const where: Record<string, unknown> = {};
  if (filter.category) where.category = filter.category;
  if (filter.city) where.city = filter.city;
  if (filter.province) where.province = filter.province;
  if (filter.status) where.status = filter.status;
  if (filter.featured !== undefined) where.featured = filter.featured;
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
      { category: { contains: filter.search, mode: "insensitive" } },
    ];
  }
  return where;
}

export const directoryRepository = {
  async findMany(filter: DirectoryFilter = {}): Promise<DirectoryEntryWithIncludes[]> {
    return prisma.directoryEntry.findMany({
      select: defaultSelect,
      where: buildWhere(filter) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: filter.limit ?? 100,
      skip: filter.offset ?? 0,
    }) as unknown as DirectoryEntryWithIncludes[];
  },

  async findById(id: string): Promise<DirectoryEntryWithIncludes | null> {
    return prisma.directoryEntry.findUnique({ where: { id }, select: defaultSelect }) as unknown as DirectoryEntryWithIncludes | null;
  },

  async count(filter: DirectoryFilter = {}): Promise<number> {
    return prisma.directoryEntry.count({ where: buildWhere(filter) as any }); // eslint-disable-line @typescript-eslint/no-explicit-any
  },

  async create(data: Record<string, unknown>): Promise<DirectoryEntryWithIncludes> {
    return prisma.directoryEntry.create({ data: data as any, select: defaultSelect }) as unknown as DirectoryEntryWithIncludes; // eslint-disable-line @typescript-eslint/no-explicit-any
  },

  async update(id: string, data: Record<string, unknown>): Promise<DirectoryEntryWithIncludes> {
    return prisma.directoryEntry.update({ where: { id }, data: data as any, select: defaultSelect }) as unknown as DirectoryEntryWithIncludes; // eslint-disable-line @typescript-eslint/no-explicit-any
  },

  async delete(id: string): Promise<void> {
    await prisma.directoryEntry.delete({ where: { id } });
  },
};
