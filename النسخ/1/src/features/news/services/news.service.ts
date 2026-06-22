import { newsRepository } from "../repositories";
import { CreateNewsSchema, UpdateNewsSchema } from "../schemas";
import type { CreateNewsDto, UpdateNewsDto } from "../schemas";
import { toSlug } from "@/lib/utils";
import type { NewsResponse, NewsWithIncludes } from "../types";
import type { Prisma } from "@/generated/prisma/client";

function toNewsResponse(item: NewsWithIncludes): NewsResponse {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    body: item.body,
    status: item.status as NewsResponse["status"],
    viewCount: item.viewCount,
    publishedAt: item.publishedAt?.toISOString() ?? null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    category: { id: item.category.id, name: item.category.name, slug: item.category.slug },
    region: item.region ? { id: item.region.id, name: item.region.name, slug: item.region.slug } : null,
    media: item.media.map((m) => ({
      id: m.id,
      url: m.url,
      filename: m.filename,
      originalName: m.originalName,
      mimeType: m.mimeType,
      size: m.size,
    })),
  };
}

export const newsService = {
  async list(filter = {}): Promise<NewsResponse[]> {
    const items = await newsRepository.findMany(filter);
    return items.map(toNewsResponse);
  },

  async getById(id: string): Promise<NewsResponse | null> {
    const item = await newsRepository.findById(id);
    return item ? toNewsResponse(item) : null;
  },

  async getBySlug(slug: string): Promise<NewsResponse | null> {
    const item = await newsRepository.findBySlug(slug);
    return item ? toNewsResponse(item) : null;
  },

  async create(dto: CreateNewsDto): Promise<NewsResponse> {
    const data = CreateNewsSchema.parse(dto);
    const slug = data.slug || toSlug(data.title);

    const mediaData = data.mediaUrl
      ? {
          create: {
            url: data.mediaUrl,
            filename: data.mediaUrl.split("/").pop() || "image.jpg",
            originalName: data.mediaOriginalName || "image.jpg",
            mimeType: "image/jpeg",
            size: 0,
          },
        }
      : undefined;

    const created = await newsRepository.create({
      title: data.title,
      slug,
      summary: data.summary ?? null,
      body: data.body ?? null,
      status: data.status ?? "draft",
      publishedAt: data.status === "published" ? new Date() : undefined,
      category: { connect: { id: data.categoryId } },
      region: data.regionId ? { connect: { id: data.regionId } } : undefined,
      media: mediaData,
    });

    return toNewsResponse(created);
  },

  async update(id: string, dto: UpdateNewsDto): Promise<NewsResponse | null> {
    const data = UpdateNewsSchema.parse(dto);
    const updateData: Prisma.NewsUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.body !== undefined) updateData.body = data.body;
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === "published") updateData.publishedAt = new Date();
    }
    if (data.categoryId !== undefined) updateData.category = { connect: { id: data.categoryId } };
    if (data.regionId !== undefined) {
      updateData.region = data.regionId ? { connect: { id: data.regionId } } : { disconnect: true };
    }

    const item = await newsRepository.update(id, updateData);
    return toNewsResponse(item);
  },

  async delete(id: string): Promise<void> {
    await newsRepository.delete(id);
  },

  async publish(id: string): Promise<NewsResponse> {
    const item = await newsRepository.update(id, {
      status: "published",
      publishedAt: new Date(),
    } as Prisma.NewsUpdateInput);
    return toNewsResponse(item);
  },

  async archive(id: string): Promise<NewsResponse> {
    const item = await newsRepository.update(id, { status: "archived" } as Prisma.NewsUpdateInput);
    return toNewsResponse(item);
  },

  async incrementViews(id: string): Promise<void> {
    await newsRepository.incrementViews(id);
  },
};
