import { z } from "zod/v4";

export const CreateAdSchema = z.object({
  title: z.string().min(2, "العنوان يجب أن يكون 2 أحرف على الأقل").max(200, "العنوان طويل جداً"),
  content: z.string().max(1000).nullable().optional(),
  imageUrl: z.string().max(500).nullable().optional().or(z.literal("")),
  linkUrl: z.string().max(500).nullable().optional().or(z.literal("")),
  position: z.enum(["sidebar", "banner_top", "banner_bottom", "inline", "popup"]).default("sidebar"),
  status: z.string().default("active"),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
});

export const UpdateAdSchema = CreateAdSchema.partial();

export type CreateAdDto = z.infer<typeof CreateAdSchema>;
export type UpdateAdDto = z.infer<typeof UpdateAdSchema>;
