"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewsFiltersProps {
  categories: { id: string; name: string; slug: string }[];
  regions: { id: string; name: string; slug: string }[];
}

export default function NewsFilters({ categories, regions }: NewsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const regionId = searchParams.get("regionId") ?? "";

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/news?${params.toString()}`);
    },
    [router, searchParams],
  );

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/news?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/news");
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="بحث عن خبر..."
          defaultValue={search}
          onChange={handleSearch}
        />
      </div>

      <Select value={status} onValueChange={(v) => setParam("status", v ?? "")}>
        <SelectTrigger>
          <SelectValue placeholder="الحالة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">الكل</SelectItem>
          <SelectItem value="draft">مسودة</SelectItem>
          <SelectItem value="published">منشور</SelectItem>
          <SelectItem value="archived">مؤرشف</SelectItem>
        </SelectContent>
      </Select>

      <Select value={categoryId} onValueChange={(v) => setParam("categoryId", v ?? "")}>
        <SelectTrigger>
          <SelectValue placeholder="التصنيف" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">كل التصنيفات</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={regionId} onValueChange={(v) => setParam("regionId", v ?? "")}>
        <SelectTrigger>
          <SelectValue placeholder="المنطقة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">كل المناطق</SelectItem>
          {regions.map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(search || status || categoryId || regionId) && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          إلغاء الفلترة
        </Button>
      )}
    </div>
  );
}
