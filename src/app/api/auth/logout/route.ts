import { NextRequest } from "next/server";
import { signOut } from "@/lib/auth";
import { rateLimitMiddleware } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const rateLimitResponse = await rateLimitMiddleware({ max: 10, windowMs: 60_000 }, "auth")(request);
  if (rateLimitResponse) return rateLimitResponse;

  await signOut({ redirectTo: "/login" });
}
