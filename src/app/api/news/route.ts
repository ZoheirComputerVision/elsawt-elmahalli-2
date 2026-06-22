import { NextRequest } from "next/server";
import { newsService } from "@/features/news/services";
import { ok, created, badRequest, serverError, unauthorized } from "@/features/news/api";
import { CreateNewsSchema } from "@/features/news/schemas";
import { requireRole } from "@/features/auth";
import { prisma } from "@/lib/prisma";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware({ max: 60, windowMs: 60_000 }, "news")(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const filter: Record<string, string | number> = {};

    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");
    const regionId = searchParams.get("regionId");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    if (status) filter.status = status;
    if (categoryId) filter.categoryId = categoryId;
    if (regionId) filter.regionId = regionId;
    if (search) filter.search = search;
    if (limit) filter.limit = Number(limit);
    if (offset) filter.offset = Number(offset);

    const data = await newsService.list(filter);
    return ok(data, { count: data.length });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware({ max: 20, windowMs: 60_000 }, "news")(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const user = await requireRole("REPORTER");
    if (!user) return unauthorized();

    const body = await request.json();
    const parsed = CreateNewsSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((e) => e.message).join("، "));
    }

    const data = await newsService.create(parsed.data);

    await prisma.auditLog.create({
      data: {
        action: "CREATE_NEWS",
        entity: "News",
        entityId: data.id,
        details: `إنشاء خبر: ${data.title}`,
        userId: user.id,
      },
    });

    return created(data);
  } catch (error) {
    return serverError(error);
  }
}
