import { NextRequest } from "next/server";
import { newsService } from "@/features/news/services";
import { ok, notFound, badRequest, serverError } from "@/features/news/api";
import { UpdateNewsSchema } from "@/features/news/schemas";

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

    const data = await newsService.update(slug, parsed.data);
    if (!data) return notFound("الخبر غير موجود");
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
    const { slug } = await params;

    const existing = await newsService.getById(slug);
    if (!existing) return notFound("الخبر غير موجود");

    await newsService.delete(slug);
    return ok({ message: "تم حذف الخبر بنجاح" });
  } catch (error) {
    return serverError(error);
  }
}
