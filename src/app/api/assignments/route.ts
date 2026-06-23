import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "غير مصرح" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const assignedTo = searchParams.get("assignedTo");
  const role = session.user.role;

  const where: Record<string, string> = {};
  if (status) where.status = status;
  if (assignedTo) where.assignedToId = assignedTo;
  if (role === "REPORTER") where.assignedToId = session.user.id;

  const assignments = await prisma.assignment.findMany({
    where,
    include: {
      assignedBy: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true, avatar: true } },
      commune: { select: { id: true, name: true, slug: true } },
      _count: { select: { comments: true, attachments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ success: true, data: assignments });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const assignment = await prisma.assignment.create({
      data: {
        title: body.title,
        description: body.description,
        type: body.type ?? "news",
        priority: body.priority ?? "medium",
        status: "pending",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        location: body.location,
        assignedById: session.user.id,
        assignedToId: body.assignedToId,
        communeId: body.communeId ?? null,
        newsId: body.newsId ?? null,
      },
      include: {
        assignedBy: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, avatar: true } },
        commune: { select: { id: true, name: true } },
      },
    });

    return Response.json({ success: true, data: assignment }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
