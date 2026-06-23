import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  const accounts = await prisma.socialAccount.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });
  return Response.json({ success: true, data: accounts });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const account = await prisma.socialAccount.create({
      data: {
        platform: body.platform,
        name: body.name,
        pageId: body.pageId ?? null,
        pageName: body.pageName ?? null,
        username: body.username ?? null,
        accessToken: body.accessToken,
        tokenExpiresAt: body.tokenExpiresAt ? new Date(body.tokenExpiresAt) : null,
        isActive: body.isActive ?? true,
        autoPost: body.autoPost ?? false,
        createdById: session.user.id,
      },
    });
    return Response.json({ success: true, data: account }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
