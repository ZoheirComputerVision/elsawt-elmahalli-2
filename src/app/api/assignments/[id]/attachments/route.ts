import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;

  const assignment = await prisma.assignment.findUnique({ where: { id } });
  if (!assignment) return Response.json({ error: "غير موجود" }, { status: 404 });

  if (session.user.role === "REPORTER" && assignment.assignedToId !== session.user.id) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return Response.json({ error: "الملف مطلوب" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const uploadDir = "public/uploads/assignments";
  const fs = await import("fs/promises");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(`${uploadDir}/${filename}`, buffer);

  const attachment = await prisma.assignmentAttachment.create({
    data: {
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: `/uploads/assignments/${filename}`,
      assignmentId: id,
      userId: session.user.id,
    },
    include: { user: { select: { id: true, name: true } } },
  });

  return Response.json({ success: true, data: attachment }, { status: 201 });
}
