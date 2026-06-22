export type NewsStatus = "draft" | "review" | "approved" | "published" | "archived";

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
}

export interface RegionDto {
  id: string;
  name: string;
  slug: string;
}

export interface MediaDto {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface UserDto {
  id: string;
  name: string;
  bio: string | null;
  specialization: string | null;
}

export interface NewsResponse {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  status: NewsStatus;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  category: CategoryDto;
  region: RegionDto | null;
  communeId: string | null;
  regionId: string | null;
  createdBy: UserDto | null;
  media: MediaDto[];
}

export interface CreateNewsRequest {
  title: string;
  slug?: string;
  summary?: string | null;
  body?: string | null;
  status?: NewsStatus;
  categoryId: string;
  regionId?: string | null;
  mediaUrl?: string;
  mediaOriginalName?: string;
}

export type UpdateNewsRequest = Partial<CreateNewsRequest>;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

export type { NewsFilter } from "./index";
