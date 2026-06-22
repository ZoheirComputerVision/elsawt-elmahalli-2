import { NextRequest } from "next/server";
import { requireRole } from "@/features/auth";
import { geographicRepository } from "@/features/geographic/repositories";
import { prisma } from "@/lib/prisma";
import { ok, serverError, unauthorized, notFound } from "@/features/news/api";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await geographicRepository.getDairaById(id);
    if (!item) return notFound("الدائرة غير موجودة");
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
    const updated = await geographicRepository.updateDaira(id, { name: body.name, slug: body.slug, active: body.active });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_DAIRA",
        entity: "Daira",
        entityId: id,
        details: `تحديث دائرة: ${updated.name}`,
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
    await geographicRepository.deleteDaira(id);

    await prisma.auditLog.create({
      data: {
        action: "DELETE_DAIRA",
        entity: "Daira",
        entityId: id,
        details: `حذف دائرة`,
        userId: user.id,
      },
    });

    return ok({ deleted: true });
  } catch (error) {
    return serverError(error);
  }
}
