import { NextRequest } from "next/server";
import { newsService } from "@/features/news/services";
import { ok, notFound, badRequest, serverError, unauthorized, forbidden } from "@/features/news/api";
import { UpdateNewsSchema } from "@/features/news/schemas";
import { requireRole } from "@/features/auth";
import { prisma } from "@/lib/prisma";
import { postToSocial } from "@/lib/social";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    let data = await newsService.getBySlug(slug);
    if (!data) {
      data = await newsService.getById(slug);
    }

    if (!data) return notFound("الخبر غير موجود");
    return ok(data);
  } catch (error) {
    return serverError(error);
  }
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ["draft", "review"],
  review: ["review", "approved"],
  approved: ["approved", "published"],
  published: ["published", "archived"],
  archived: ["archived"],
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const parsed = UpdateNewsSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((e) => e.message).join("، "));
    }

    const existing = await newsService.getBySlug(slug);
    if (!existing) return notFound("الخبر غير موجود");

    const newStatus = parsed.data.status;
    const currentStatus = existing.status;

    let actingUser = null;

    if (newStatus && newStatus !== currentStatus) {
      const allowed = VALID_TRANSITIONS[currentStatus] ?? [];
      if (!allowed.includes(newStatus)) {
        return badRequest(`لا يمكن تغيير الحالة من "${currentStatus}" إلى "${newStatus}"`);
      }
      if (newStatus === "review" || newStatus === "approved") {
        actingUser = await requireRole("EDITOR");
        if (!actingUser) return forbidden();
      } else if (newStatus === "published" || newStatus === "archived") {
        actingUser = await requireRole("ADMIN");
        if (!actingUser) return forbidden();
      }
    }

    if (!actingUser) {
      actingUser = await requireRole("REPORTER");
      if (!actingUser) return unauthorized();
    }

    const data = await newsService.update(slug, parsed.data);
    if (!data) return notFound("الخبر غير موجود");

    const isStatusChange = newStatus && newStatus !== currentStatus;
    const action = isStatusChange
      ? `UPDATE_NEWS_STATUS:${currentStatus}→${newStatus}`
      : "UPDATE_NEWS";

    await prisma.auditLog.create({
      data: {
        action,
        entity: "News",
        entityId: data.id,
        details: isStatusChange
          ? `تغيير حالة الخبر "${data.title}" من "${currentStatus}" إلى "${newStatus}"`
          : `تحديث خبر: ${data.title}`,
        userId: actingUser.id,
      },
    });

    if (isStatusChange && newStatus === "published") {
      const slugToUse = data.slug ?? slug;
      const newsUrl = `${process.env.NEXTAUTH_URL ?? "https://school-news-ai-209c.apps.hostingguru.io"}/news/${slugToUse}`;
      const socialAccounts = await prisma.socialAccount.findMany({ where: { isActive: true, autoPost: true } });

      for (const acc of socialAccounts) {
        const msg = `${data.title}\n${data.summary ?? ""}`.trim();
        const result = await postToSocial(acc.platform, acc.accessToken, acc.pageId ?? undefined, msg, newsUrl);

        await prisma.socialPost.create({
          data: {
            platform: acc.platform,
            status: result.success ? "posted" : "failed",
            message: msg,
            postUrl: result.postUrl ?? null,
            error: result.error ?? null,
            newsId: data.id,
            accountId: acc.id,
            createdById: actingUser.id,
            postedAt: result.success ? new Date() : null,
          },
        });
      }
    }

    return ok(data);
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await requireRole("ADMIN");
    if (!user) return forbidden();

    const { slug } = await params;

    const existing = await newsService.getById(slug);
    if (!existing) return notFound("الخبر غير موجود");

    await newsService.delete(slug);

    await prisma.auditLog.create({
      data: {
        action: "DELETE_NEWS",
        entity: "News",
        entityId: slug,
        details: `حذف خبر: ${existing.title}`,
        userId: user.id,
      },
    });

    return ok({ message: "تم حذف الخبر بنجاح" });
  } catch (error) {
    return serverError(error);
  }
}
