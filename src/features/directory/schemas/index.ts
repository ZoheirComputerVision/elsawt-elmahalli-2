import { z } from "zod/v4";

export const CreateDirectoryEntrySchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون 2 أحرف على الأقل").max(200, "الاسم طويل جداً"),
  category: z.string().min(1, "التصنيف مطلوب"),
  description: z.string().max(1000).nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  email: z.string().email("البريد الإلكتروني غير صالح").nullable().optional().or(z.literal("")),
  website: z.string().max(200).nullable().optional().or(z.literal("")),
  address: z.string().max(500).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  province: z.string().max(100).nullable().optional(),
  imageUrl: z.string().max(500).nullable().optional(),
  status: z.string().default("active"),
  featured: z.boolean().default(false),
  contactName: z.string().max(200).nullable().optional(),
});

export const UpdateDirectoryEntrySchema = CreateDirectoryEntrySchema.partial();

export type CreateDirectoryEntryDto = z.infer<typeof CreateDirectoryEntrySchema>;
export type UpdateDirectoryEntryDto = z.infer<typeof UpdateDirectoryEntrySchema>;
