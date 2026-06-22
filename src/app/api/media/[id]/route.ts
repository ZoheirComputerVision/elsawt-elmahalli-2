import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/features/auth";
import { ok, notFound, serverError, forbidden } from "@/features/news/api";
import { unlink } from "node:fs/promises";
import { join } from "node:path";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireRole("ADMIN");
    if (!user) return forbidden();

    const { id } = await params;
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return notFound("الملف غير موجود");

    const filePath = join(process.cwd(), "public", media.url);
    try { await unlink(filePath); } catch { /* file may not exist on disk */ }

    await prisma.media.delete({ where: { id } });
    return ok({ message: "تم حذف الملف بنجاح" });
  } catch (error) {
    return serverError(error);
  }
}
