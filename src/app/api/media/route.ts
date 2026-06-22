import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/features/auth";
import { ok, created, badRequest, serverError, unauthorized } from "@/features/news/api";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware({ max: 60, windowMs: 60_000 }, "media")(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);
    const offset = Number(searchParams.get("offset")) || 0;

    const where = search
      ? { OR: [{ filename: { contains: search } }, { originalName: { contains: search } }] }
      : {};

    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.media.count({ where }),
    ]);

    return ok(items, { count: total });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware({ max: 10, windowMs: 60_000 }, "media")(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const user = await requireRole("EDITOR");
    if (!user) return unauthorized();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return badRequest("يرجى رفع ملف");

    if (file.size > 5 * 1024 * 1024) {
      return badRequest("حجم الملف يتجاوز 5 ميجابايت");
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const allowed = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    if (!allowed.includes(ext)) {
      return badRequest("نوع الملف غير مدعوم. الأنواع المسموحة: JPG, PNG, GIF, WebP, SVG");
    }

    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, uniqueName), buffer);

    const media = await prisma.media.create({
      data: {
        filename: uniqueName,
        originalName: file.name,
        mimeType: file.type || `image/${ext}`,
        size: file.size,
        url: `/uploads/${uniqueName}`,
      },
    });

    return created(media);
  } catch (error) {
    return serverError(error);
  }
}
