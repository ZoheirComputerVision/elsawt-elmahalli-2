import { NextRequest } from "next/server";
import { adsService } from "@/features/ads";
import { CreateAdSchema } from "@/features/ads/schemas";
import { requireRole } from "@/features/auth";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, unauthorized } from "@/features/ads/api";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware({ max: 60, windowMs: 60_000 }, "ads")(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const filter: Record<string, unknown> = {};
    const position = searchParams.get("position");
    const status = searchParams.get("status");
    const active = searchParams.get("active");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    if (position) filter.position = position;
    if (status) filter.status = status;
    if (active) filter.active = active === "true";
    if (search) filter.search = search;
    if (limit) filter.limit = Number(limit);
    if (offset) filter.offset = Number(offset);

    const [items, total] = await Promise.all([
      adsService.list(filter),
      adsService.count(filter),
    ]);

    return ok(items, { count: total });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware({ max: 20, windowMs: 60_000 }, "ads")(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const user = await requireRole("EDITOR");
    if (!user) return unauthorized();

    const body = await request.json();
    const parsed = CreateAdSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((e) => e.message).join("، "));
    }

    const ad = await adsService.create(parsed.data);

    await prisma.auditLog.create({
      data: {
        action: "CREATE_AD",
        entity: "Ad",
        entityId: ad.id,
        details: `إنشاء إعلان: ${ad.title}`,
        userId: user.id,
      },
    });

    return created(ad);
  } catch (error) {
    return serverError(error);
  }
}
