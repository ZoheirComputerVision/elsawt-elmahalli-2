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
    const account = await prisma.socialAccount.update({
      where: { id },
      data: {
        platform: body.platform,
        name: body.name,
        pageId: body.pageId,
        pageName: body.pageName,
        username: body.username,
        accessToken: body.accessToken,
        tokenExpiresAt: body.tokenExpiresAt ? new Date(body.tokenExpiresAt) : null,
        isActive: body.isActive,
        autoPost: body.autoPost,
      },
    });
    return Response.json({ success: true, data: account });
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
    await prisma.socialAccount.delete({ where: { id } });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
