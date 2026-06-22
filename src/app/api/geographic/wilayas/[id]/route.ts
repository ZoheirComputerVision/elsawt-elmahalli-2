import { NextRequest } from "next/server";
import { requireRole } from "@/features/auth";
import { geographicRepository } from "@/features/geographic/repositories";
import { prisma } from "@/lib/prisma";
import { ok, badRequest, serverError, unauthorized, notFound } from "@/features/news/api";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await geographicRepository.getWilayaById(id);
    if (!item) return notFound("الولاية غير موجودة");
    return ok(item);
  } catch (error) {
    return serverError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole("ADMIN");
    if (!user) return unauthorized();

    const { id } = await params;
    const body = await request.json();

    const updated = await geographicRepository.updateWilaya(id, {
      name: body.name,
      slug: body.slug,
      code: body.code,
      active: body.active,
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_WILAYA",
        entity: "Wilaya",
        entityId: id,
        details: `تحديث ولاية: ${updated.name}`,
        userId: user.id,
      },
    });

    return ok(updated);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireRole("ADMIN");
    if (!user) return unauthorized();

    const { id } = await params;
    await geographicRepository.deleteWilaya(id);

    await prisma.auditLog.create({
      data: {
        action: "DELETE_WILAYA",
        entity: "Wilaya",
        entityId: id,
        details: `حذف ولاية`,
        userId: user.id,
      },
    });

    return ok({ deleted: true });
  } catch (error) {
    return serverError(error);
  }
}
