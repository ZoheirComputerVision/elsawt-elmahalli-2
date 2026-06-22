import { NextRequest } from "next/server";
import { directoryService } from "@/features/directory";
import { CreateDirectoryEntrySchema } from "@/features/directory/schemas";
import { requireRole } from "@/features/auth";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, unauthorized } from "@/features/directory/api";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware({ max: 60, windowMs: 60_000 }, "directory")(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const filter: Record<string, unknown> = {};
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const province = searchParams.get("province");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    if (category) filter.category = category;
    if (city) filter.city = city;
    if (province) filter.province = province;
    if (search) filter.search = search;
    if (status) filter.status = status;
    if (featured) filter.featured = featured === "true";
    if (limit) filter.limit = Number(limit);
    if (offset) filter.offset = Number(offset);

    const [items, total] = await Promise.all([
      directoryService.list(filter),
      directoryService.count(filter),
    ]);

    return ok(items, { count: total });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware({ max: 20, windowMs: 60_000 }, "directory")(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const user = await requireRole("EDITOR");
    if (!user) return unauthorized();

    const body = await request.json();
    const parsed = CreateDirectoryEntrySchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((e) => e.message).join("، "));
    }

    const entry = await directoryService.create(parsed.data);

    await prisma.auditLog.create({
      data: {
        action: "CREATE_DIRECTORY_ENTRY",
        entity: "DirectoryEntry",
        entityId: entry.id,
        details: `إنشاء قيد في الدليل: ${entry.name}`,
        userId: user.id,
      },
    });

    return created(entry);
  } catch (error) {
    return serverError(error);
  }
}
