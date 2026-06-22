import { geographicRepository } from "@/features/geographic/repositories";
import { ok, serverError } from "@/features/news/api";

export async function GET() {
  try {
    const [wilayas, dairas, communes] = await Promise.all([
      geographicRepository.countWilayas(),
      geographicRepository.countDairas(),
      geographicRepository.countCommunes(),
    ]);
    return ok({ wilayas, dairas, communes });
  } catch (error) {
    return serverError(error);
  }
}
