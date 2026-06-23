import { prisma } from "@/lib/prisma";

export async function GET() {
  const communes = await prisma.commune.findMany({
    select: { id: true, name: true, slug: true, daira: { select: { name: true, wilaya: { select: { name: true } } } } },
    orderBy: { name: "asc" },
  });
  return Response.json({ success: true, data: communes });
}
