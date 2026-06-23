import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  const where: Record<string, unknown> = { active: true };
  if (role) where.role = role;

  const users = await prisma.user.findMany({
    where,
    select: { id: true, name: true, email: true, role: true, active: true, commune: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  return Response.json({ success: true, data: users });
}
