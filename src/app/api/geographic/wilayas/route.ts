import { NextRequest } from "next/server";
import { requireRole } from "@/features/auth";
import { geographicRepository } from "@/features/geographic/repositories";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, unauthorized } from "@/features/news/api";

export async function GET() {
  try {
    const items = await geographicRepository.getWilayas();
    return ok(items);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("ADMIN");
    if (!user) return unauthorized();

    const body = await request.json();
    if (!body.name || !body.slug || !body.code) {
      return badRequest("الاسم، المعرف، ورمز الولاية مطلوبون");
    }

    const entry = await geographicRepository.createWilaya({ name: body.name, slug: body.slug, code: body.code });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_WILAYA",
        entity: "Wilaya",
        entityId: entry.id,
        details: `إنشاء ولاية: ${entry.name}`,
        userId: user.id,
      },
    });

    return created(entry);
  } catch (error) {
    return serverError(error);
  }
}
