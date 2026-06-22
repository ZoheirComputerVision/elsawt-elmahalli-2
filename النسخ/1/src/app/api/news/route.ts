import { NextRequest } from "next/server";
import { newsService } from "@/features/news/services";
import { ok, created, badRequest, serverError } from "@/features/news/api";
import { CreateNewsSchema } from "@/features/news/schemas";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter: Record<string, string | number> = {};

    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");
    const regionId = searchParams.get("regionId");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    if (status) filter.status = status;
    if (categoryId) filter.categoryId = categoryId;
    if (regionId) filter.regionId = regionId;
    if (search) filter.search = search;
    if (limit) filter.limit = Number(limit);
    if (offset) filter.offset = Number(offset);

    const data = await newsService.list(filter);
    return ok(data, { count: data.length });
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateNewsSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest(parsed.error.issues.map((e) => e.message).join("، "));
    }

    const data = await newsService.create(parsed.data);
    return created(data);
  } catch (error) {
    return serverError(error);
  }
}
