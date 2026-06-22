import { z } from "zod";

export const CreateNewsSchema = z.object({
  title: z.string().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل").max(200, "العنوان طويل جداً"),
  slug: z.string().optional(),
  summary: z.string().max(500, "الملخص طويل جداً").nullable().optional(),
  body: z.string().nullable().optional(),
  status: z.enum(["draft", "review", "approved", "published", "archived"]).default("draft"),
  categoryId: z.string().min(1, "يرجى اختيار تصنيف"),
  regionId: z.string().nullable().optional(),
  mediaUrl: z.string().optional(),
  mediaOriginalName: z.string().optional(),
});

export const UpdateNewsSchema = CreateNewsSchema.partial();

export type CreateNewsDto = z.infer<typeof CreateNewsSchema>;
export type UpdateNewsDto = z.infer<typeof UpdateNewsSchema>;
