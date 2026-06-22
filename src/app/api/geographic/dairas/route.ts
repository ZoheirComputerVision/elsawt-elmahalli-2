import { NextRequest } from "next/server";
import { requireRole } from "@/features/auth";
import { geographicRepository } from "@/features/geographic/repositories";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, unauthorized } from "@/features/news/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wilayaId = searchParams.get("wilayaId");
    let items;
    if (wilayaId) {
      items = await geographicRepository.getDairasByWilaya(wilayaId);
    } else {
      const wilayas = await geographicRepository.getWilayas();
      const results = await Promise.all(wilayas.map((w) => geographicRepository.getDairasByWilaya(w.id)));
      items = results.flat();
    }
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
    if (!body.name || !body.slug || !body.wilayaId) {
      return badRequest("الاسم، المعرف، والولاية مطلوبون");
    }

    const entry = await geographicRepository.createDaira({ name: body.name, slug: body.slug, wilayaId: body.wilayaId });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_DAIRA",
        entity: "Daira",
        entityId: entry.id,
        details: `إنشاء دائرة: ${entry.name}`,
        userId: user.id,
      },
    });

    return created(entry);
  } catch (error) {
    return serverError(error);
  }
}
