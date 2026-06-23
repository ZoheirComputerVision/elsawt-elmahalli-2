import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allNews = await prisma.news.findMany({
    include: { category: { select: { name: true } }, media: { select: { url: true, originalName: true } } },
    orderBy: { createdAt: "desc" },
  });

  const exportDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

  const filename = `archive-${new Date().toISOString().split("T")[0]}.json`;
  const filepath = path.join(exportDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(allNews, null, 2), "utf8");

  return NextResponse.json({ file: filename, count: allNews.length, path: filepath });
}
