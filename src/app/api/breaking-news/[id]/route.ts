import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const alert = await prisma.breakingNews.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        link: body.link,
        priority: body.priority,
        isActive: body.isActive,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        newsId: body.newsId,
      },
    });
    return Response.json({ success: true, data: alert });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const { id } = await params;
    await prisma.breakingNews.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
