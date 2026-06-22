"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateNewsSchema, type CreateNewsDto } from "@/features/news/schemas";
import type { Resolver } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { NewsResponse } from "@/features/news/types";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface RegionOption {
  id: string;
  name: string;
  slug: string;
}

interface NewsFormProps {
  initialData?: NewsResponse;
  categories: CategoryOption[];
  regions: RegionOption[];
}

export default function NewsForm({ initialData, categories, regions }: NewsFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateNewsDto>({
    resolver: zodResolver(CreateNewsSchema) as unknown as Resolver<CreateNewsDto>,
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          summary: initialData.summary ?? "",
          body: initialData.body ?? "",
          status: initialData.status,
          categoryId: initialData.category.id,
          regionId: initialData.region?.id ?? null,
          mediaUrl: initialData.media[0]?.url ?? "",
          mediaOriginalName: initialData.media[0]?.originalName ?? "",
        }
      : {
          title: "",
          slug: "",
          summary: "",
          body: "",
          status: "draft",
          categoryId: "",
          regionId: null,
          mediaUrl: "",
          mediaOriginalName: "",
        },
  });

  const selectedCategory = watch("categoryId");
  const selectedRegion = watch("regionId");
  const selectedStatus = watch("status");
  const currentSlug = watch("slug");

  async function onSubmit(data: CreateNewsDto) {
    try {
      const url = isEdit ? `/api/news/${initialData.slug}` : "/api/news";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit ? { ...data, slug: undefined } : data;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || "حدث خطأ أثناء الحفظ");
        return;
      }

      toast.success(isEdit ? "تم تحديث الخبر بنجاح" : "تم إنشاء الخبر بنجاح");
      router.push("/news");
      router.refresh();
    } catch {
      toast.error("فشل الاتصال بالخادم");
    }
  }

  function generateSlug(title: string) {
    const slug = title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();
    setValue("slug", slug);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">العنوان</Label>
          <Input
            id="title"
            {...register("title")}
            onBlur={(e) => {
              if (!isEdit && !currentSlug) {
                generateSlug(e.target.value);
              }
            }}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">الرابط المختصر</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && (
            <p className="text-xs text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">ملخص الخبر</Label>
        <Textarea id="summary" {...register("summary")} rows={3} />
        {errors.summary && (
          <p className="text-xs text-destructive">{errors.summary.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">محتوى الخبر</Label>
        <Textarea id="body" {...register("body")} rows={10} />
        {errors.body && (
          <p className="text-xs text-destructive">{errors.body.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>التصنيف</Label>
          <Select
            value={selectedCategory}
            onValueChange={(v) => setValue("categoryId", v ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر تصنيفاً" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-xs text-destructive">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>المنطقة</Label>
          <Select
            value={selectedRegion ?? ""}
            onValueChange={(v) => setValue("regionId", v || null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر منطقة (اختياري)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">بدون منطقة</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>الحالة</Label>
          <Select
            value={selectedStatus ?? "draft"}
            onValueChange={(v) => setValue("status", (v ?? "draft") as CreateNewsDto["status"])}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">مسودة</SelectItem>
              <SelectItem value="published">منشور</SelectItem>
              <SelectItem value="archived">مؤرشف</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-xs text-destructive">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mediaUrl">رابط الصورة المميزة</Label>
        <Input id="mediaUrl" {...register("mediaUrl")} placeholder="https://example.com/image.jpg" />
      </div>

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جاري الحفظ..." : isEdit ? "تحديث الخبر" : "إنشاء الخبر"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
      </div>
    </form>
  );
}
