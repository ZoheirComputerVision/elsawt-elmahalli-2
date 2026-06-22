import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware({ max: 10, windowMs: 60_000 }, "ad-view")(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { adId } = await request.json();
    if (!adId) return Response.json({ success: false, error: "معرف الإعلان مطلوب" }, { status: 400 });

    await Promise.all([
      prisma.ad.update({ where: { id: adId }, data: { views: { increment: 1 }, clicks: { increment: 1 } } }),
      prisma.adView.create({ data: { adId } }),
    ]);

    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false, error: "خطأ داخلي" }, { status: 500 });
  }
}
