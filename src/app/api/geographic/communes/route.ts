import { NextRequest } from "next/server";
import { requireRole } from "@/features/auth";
import { geographicRepository } from "@/features/geographic/repositories";
import { prisma } from "@/lib/prisma";
import { ok, created, badRequest, serverError, unauthorized } from "@/features/news/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dairaId = searchParams.get("dairaId");
    let items;
    if (dairaId) {
      items = await geographicRepository.getCommunesByDaira(dairaId);
    } else {
      const wilayas = await geographicRepository.getWilayas();
      const allCommunePromises = [];
      for (const w of wilayas) {
        const dairas = await geographicRepository.getDairasByWilaya(w.id);
        for (const d of dairas) {
          allCommunePromises.push(geographicRepository.getCommunesByDaira(d.id));
        }
      }
      const results = await Promise.all(allCommunePromises);
      items = results.flat();
    }
    return ok(items);
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("ADMIN");
    if (!user) return unauthorized();

    const body = await request.json();
    if (!body.name || !body.slug || !body.dairaId) {
      return badRequest("الاسم، المعرف، والدائرة مطلوبون");
    }

    const entry = await geographicRepository.createCommune({ name: body.name, slug: body.slug, dairaId: body.dairaId });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_COMMUNE",
        entity: "Commune",
        entityId: entry.id,
        details: `إنشاء بلدية: ${entry.name}`,
        userId: user.id,
      },
    });

    return created(entry);
  } catch (error) {
    return serverError(error);
  }
}
