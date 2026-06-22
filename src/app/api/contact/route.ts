import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware({ max: 10, windowMs: 60_000 }, "contact")(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { type, name, email, phone, subject, message } = await request.json();
    if (!name || !email || !message) {
      return Response.json({ success: false, error: "الحقول المطلوبة: الاسم، البريد، الرسالة" }, { status: 400 });
    }

    await prisma.contactMessage.create({ data: { type: type || "general", name, email, phone, subject, message } });

    return Response.json({ success: true, message: "تم إرسال رسالتك بنجاح" });
  } catch {
    return Response.json({ success: false, error: "خطأ داخلي" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    return Response.json({ success: true, data: messages });
  } catch {
    return Response.json({ success: false, error: "خطأ داخلي" }, { status: 500 });
  }
}
