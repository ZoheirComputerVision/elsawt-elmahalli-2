import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";
import { postToSocial } from "@/lib/social";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  const posts = await prisma.socialPost.findMany({
    include: {
      news: { select: { id: true, title: true, slug: true } },
      account: { select: { id: true, name: true, platform: true } },
      createdBy: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return Response.json({ success: true, data: posts });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "EDITOR"].includes(session.user.role)) {
    return Response.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const account = await prisma.socialAccount.findUnique({ where: { id: body.accountId } });
    if (!account) return Response.json({ success: false, error: "الحساب غير موجود" }, { status: 404 });

    if (!account.isActive) return Response.json({ success: false, error: "الحساب غير نشط" }, { status: 400 });

    const result = await postToSocial(
      account.platform,
      account.accessToken,
      account.pageId ?? undefined,
      body.message,
      body.link,
    );

    const post = await prisma.socialPost.create({
      data: {
        platform: account.platform,
        status: result.success ? "posted" : "failed",
        message: body.message,
        postUrl: result.postUrl ?? null,
        error: result.error ?? null,
        newsId: body.newsId ?? null,
        accountId: account.id,
        createdById: session.user.id,
        postedAt: result.success ? new Date() : null,
      },
    });

    return Response.json({ success: true, data: post }, { status: result.success ? 201 : 200 });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
