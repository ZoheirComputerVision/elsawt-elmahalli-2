import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const assignment = await prisma.assignment.findUnique({ where: { id } });
  if (!assignment) return Response.json({ error: "غير موجود" }, { status: 404 });

  if (session.user.role === "REPORTER" && assignment.assignedToId !== session.user.id) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  const comment = await prisma.assignmentComment.create({
    data: {
      content: body.content,
      assignmentId: id,
      userId: session.user.id,
    },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  return Response.json({ success: true, data: comment }, { status: 201 });
}
