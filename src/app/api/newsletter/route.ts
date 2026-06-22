import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware({ max: 10, windowMs: 60_000 }, "newsletter")(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { email, name } = await request.json();
    if (!email || !email.includes("@")) {
      return Response.json({ success: false, error: "بريد إلكتروني غير صالح" }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscription.findUnique({ where: { email } });
    if (existing) {
      if (!existing.active) {
        await prisma.newsletterSubscription.update({ where: { id: existing.id }, data: { active: true } });
        return Response.json({ success: true, message: "تم إعادة تفعيل الاشتراك" });
      }
      return Response.json({ success: false, error: "البريد مشترك بالفعل" }, { status: 409 });
    }

    await prisma.newsletterSubscription.create({ data: { email, name: name || null } });
    return Response.json({ success: true, message: "تم الاشتراك بنجاح" });
  } catch {
    return Response.json({ success: false, error: "خطأ داخلي" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const subscriptions = await prisma.newsletterSubscription.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return Response.json({ success: true, data: subscriptions });
  } catch {
    return Response.json({ success: false, error: "خطأ داخلي" }, { status: 500 });
  }
}
