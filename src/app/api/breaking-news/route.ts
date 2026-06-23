import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET() {
  const alerts = await prisma.breakingNews.findMany({
    where: { isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] },
    include: { createdBy: { select: { id: true, name: true } } },
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });
  return Response.json({ success: true, data: alerts });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const alert = await prisma.breakingNews.create({
      data: {
        title: body.title,
        content: body.content ?? null,
        link: body.link ?? null,
        priority: body.priority ?? "high",
        isActive: true,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        createdById: session.user.id,
        newsId: body.newsId ?? null,
      },
    });
    return Response.json({ success: true, data: alert }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
