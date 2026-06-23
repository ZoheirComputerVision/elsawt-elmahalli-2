import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wilayaSlug = searchParams.get("wilaya");
    const dairaSlug = searchParams.get("daira");
    const communeSlug = searchParams.get("commune");
    const q = searchParams.get("q");

    const where: any = {};

    if (communeSlug) {
      const commune = await prisma.commune.findFirst({
        where: { slug: communeSlug, daira: dairaSlug ? { slug: dairaSlug } : undefined },
        select: { id: true, name: true, daira: { select: { name: true, wilaya: { select: { name: true } } } } },
      });
      if (!commune) {
        return Response.json({ success: false, error: "البلدية غير موجودة" }, { status: 404 });
      }
      return Response.json({
        success: true,
        data: { type: "commune", result: commune },
      });
    }

    if (dairaSlug) {
      const daira = await prisma.daira.findFirst({
        where: { slug: dairaSlug, wilaya: wilayaSlug ? { slug: wilayaSlug } : undefined },
        include: {
          wilaya: { select: { name: true, slug: true } },
          communes: {
            select: { id: true, name: true, slug: true,
              _count: { select: { news: { where: { status: "published" } }, reporters: { where: { active: true } } } },
            },
          },
        },
      });
      if (!daira) {
        return Response.json({ success: false, error: "الدائرة غير موجودة" }, { status: 404 });
      }
      return Response.json({
        success: true,
        data: { type: "daira", result: daira },
      });
    }

    if (wilayaSlug) {
      const wilaya = await prisma.wilaya.findUnique({
        where: { slug: wilayaSlug },
        include: {
          dairas: {
            include: {
              _count: { select: { communes: true } },
            },
          },
        },
      });
      if (!wilaya) {
        return Response.json({ success: false, error: "الولاية غير موجودة" }, { status: 404 });
      }
      return Response.json({
        success: true,
        data: { type: "wilaya", result: wilaya },
      });
    }

    if (q) {
      const [wilayas, dairas, communes, reporters] = await Promise.all([
        prisma.wilaya.findMany({ where: { name: { contains: q, mode: "insensitive" } }, select: { id: true, name: true, slug: true } }),
        prisma.daira.findMany({ where: { name: { contains: q, mode: "insensitive" } }, select: { id: true, name: true, slug: true, wilaya: { select: { name: true } } } }),
        prisma.commune.findMany({ where: { name: { contains: q, mode: "insensitive" } }, select: { id: true, name: true, slug: true, daira: { select: { name: true, wilaya: { select: { name: true } } } } } }),
        prisma.user.findMany({ where: { name: { contains: q, mode: "insensitive" }, role: "REPORTER", active: true }, select: { id: true, name: true, commune: { select: { name: true, daira: { select: { name: true, wilaya: { select: { name: true } } } } } } } }),
      ]);
      return Response.json({ success: true, data: { type: "search", q, wilayas, dairas, communes, reporters } });
    }

    const allWilayas = await prisma.wilaya.findMany({
      select: { id: true, name: true, slug: true, _count: { select: { dairas: true } } },
      orderBy: { name: "asc" },
    });
    return Response.json({ success: true, data: { type: "index", wilayas: allWilayas } });
  } catch (error) {
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
