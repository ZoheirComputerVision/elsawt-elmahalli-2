import { NextRequest } from "next/server";
import { adsService } from "@/features/ads";
import { UpdateAdSchema } from "@/features/ads/schemas";
import { requireRole } from "@/features/auth";
import { prisma } from "@/lib/prisma";
import { ok, notFound, badRequest, serverError, unauthorized, forbidden } from "@/features/ads/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const ad = await adsService.getById(id);
    if (!ad) return notFound("الإعلان غير موجود");
    return ok(ad);
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireRole("EDITOR");
    if (!user) return unauthorized();

    const { id } = await params;
    const existing = await adsService.getById(id);
    if (!existing) return notFound("الإعلان غير موجود");

    const body = await request.json();
    const parsed = UpdateAdSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((e) => e.message).join("، "));
    }

    const ad = await adsService.update(id, parsed.data);

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_AD",
        entity: "Ad",
        entityId: id,
        details: `تحديث إعلان: ${ad.title}`,
        userId: user.id,
      },
    });

    return ok(ad);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireRole("ADMIN");
    if (!user) return forbidden();

    const { id } = await params;
    const existing = await adsService.getById(id);
    if (!existing) return notFound("الإعلان غير موجود");

    await adsService.delete(id);

    await prisma.auditLog.create({
      data: {
        action: "DELETE_AD",
        entity: "Ad",
        entityId: id,
        details: `حذف إعلان: ${existing.title}`,
        userId: user.id,
      },
    });

    return ok({ message: "تم حذف الإعلان بنجاح" });
  } catch (error) {
    return serverError(error);
  }
}
