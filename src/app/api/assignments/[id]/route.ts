import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      assignedBy: { select: { id: true, name: true, avatar: true } },
      assignedTo: { select: { id: true, name: true, avatar: true } },
      commune: { select: { id: true, name: true, slug: true, daira: { select: { name: true, wilaya: { select: { name: true } } } } } },
      news: { select: { id: true, title: true, slug: true, status: true } },
      comments: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: "asc" },
      },
      attachments: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!assignment) return Response.json({ error: "غير موجود" }, { status: 404 });

  if (session.user.role === "REPORTER" && assignment.assignedToId !== session.user.id) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  return Response.json({ success: true, data: assignment });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const assignment = await prisma.assignment.findUnique({ where: { id } });
  if (!assignment) return Response.json({ error: "غير موجود" }, { status: 404 });

  if (session.user.role === "REPORTER" && assignment.assignedToId !== session.user.id) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  const allowed: Record<string, unknown> = {};
  if (body.status) allowed.status = body.status;
  if (body.title) allowed.title = body.title;
  if (body.description !== undefined) allowed.description = body.description;
  if (body.priority) allowed.priority = body.priority;
  if (body.dueDate !== undefined) allowed.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  if (body.location !== undefined) allowed.location = body.location;

  const updated = await prisma.assignment.update({
    where: { id },
    data: allowed,
    include: {
      assignedBy: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true, avatar: true } },
    },
  });

  return Response.json({ success: true, data: updated });
}
