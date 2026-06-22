import type { News, Category, Region, Tag, Media } from "@/generated/prisma/client";

export type NewsStatus = "draft" | "published" | "archived";

export type NewsWithRelations = News & {
  category: Category;
  region: Region | null;
  media: Media[];
  tags: (Tag & { newsTag?: { tagId: string } })[];
};

export type CreateNewsInput = {
  title: string;
  slug?: string;
  summary?: string | null;
  body?: string | null;
  status?: NewsStatus;
  categoryId: string;
  regionId?: string | null;
};

export type UpdateNewsInput = Partial<CreateNewsInput>;

export type NewsFilter = {
  status?: NewsStatus;
  categoryId?: string;
  regionId?: string;
  tagId?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

export interface NewsWithIncludes {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  status: string;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  regionId: string | null;
  communeId: string | null;
  category: { id: string; name: string; slug: string; createdAt: Date; updatedAt: Date };
  region: { id: string; name: string; slug: string; createdAt: Date; updatedAt: Date } | null;
  media: { id: string; filename: string; originalName: string; mimeType: string; size: number; url: string; newsId: string | null; createdAt: Date }[];
  createdBy: { id: string; name: string; bio: string | null; specialization: string | null } | null;
}

export * from "./api";
