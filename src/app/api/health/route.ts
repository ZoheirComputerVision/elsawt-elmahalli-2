import { prisma } from "@/lib/prisma";
import { ok } from "@/features/news/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - dbStart;

    const prismaStart = Date.now();
    await prisma.wilaya.count();
    const prismaLatency = Date.now() - prismaStart;

    const status = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: "connected",
        latency: `${dbLatency}ms`,
      },
      prisma: {
        status: "connected",
        latency: `${prismaLatency}ms`,
      },
      storage: {
        status: "local_filesystem",
        path: "public/uploads/",
        configured: "Supabase Storage pending (Sprint 1.9)",
      },
      application: {
        version: "1.2.0",
        phase: "PRODUCTION_READINESS",
        environment: process.env.NODE_ENV ?? "development",
        nodeVersion: process.version,
        routes: 36,
      },
    };

    return ok(status);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      {
        success: false,
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: errorMessage,
      },
      { status: 503 },
    );
  }
}
