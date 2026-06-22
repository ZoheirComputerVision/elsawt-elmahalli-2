import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, serverError } from "@/features/news/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    if (!q) return badRequest("يرجى إدخال كلمة البحث");

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(Number(searchParams.get("limit")) || 12, 50);
    const offset = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where: {
          status: "published",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { summary: { contains: q, mode: "insensitive" } },
            { body: { contains: q, mode: "insensitive" } },
            { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
          ],
        },
        orderBy: { publishedAt: "desc" },
        take: limit,
        skip: offset,
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          publishedAt: true,
          category: { select: { name: true, slug: true } },
          tags: { select: { tag: { select: { name: true, slug: true } } } },
          region: { select: { name: true, slug: true } },
        },
      }),
      prisma.news.count({
        where: {
          status: "published",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { summary: { contains: q, mode: "insensitive" } },
            { body: { contains: q, mode: "insensitive" } },
            { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
          ],
        },
      }),
    ]);

    return ok(items, { count: total, page, limit, pages: Math.ceil(total / limit) });
  } catch (error) {
    return serverError(error);
  }
}
