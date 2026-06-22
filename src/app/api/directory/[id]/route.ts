import { NextRequest } from "next/server";
import { directoryService } from "@/features/directory";
import { UpdateDirectoryEntrySchema } from "@/features/directory/schemas";
import { requireRole } from "@/features/auth";
import { prisma } from "@/lib/prisma";
import { ok, notFound, badRequest, serverError, unauthorized, forbidden } from "@/features/directory/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const entry = await directoryService.getById(id);
    if (!entry) return notFound("القيد غير موجود");
    return ok(entry);
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
    const existing = await directoryService.getById(id);
    if (!existing) return notFound("القيد غير موجود");

    const body = await request.json();
    const parsed = UpdateDirectoryEntrySchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((e) => e.message).join("، "));
    }

    const entry = await directoryService.update(id, parsed.data);

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_DIRECTORY_ENTRY",
        entity: "DirectoryEntry",
        entityId: id,
        details: `تحديث قيد في الدليل: ${entry.name}`,
        userId: user.id,
      },
    });

    return ok(entry);
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
    const existing = await directoryService.getById(id);
    if (!existing) return notFound("القيد غير موجود");

    await directoryService.delete(id);

    await prisma.auditLog.create({
      data: {
        action: "DELETE_DIRECTORY_ENTRY",
        entity: "DirectoryEntry",
        entityId: id,
        details: `حذف قيد من الدليل: ${existing.name}`,
        userId: user.id,
      },
    });

    return ok({ message: "تم حذف القيد بنجاح" });
  } catch (error) {
    return serverError(error);
  }
}
