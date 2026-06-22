"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { NewsResponse } from "@/features/news/types";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  draft: { label: "مسودة", variant: "secondary" },
  review: { label: "قيد المراجعة", variant: "outline" },
  approved: { label: "معتمد", variant: "default" },
  published: { label: "منشور", variant: "default" },
  archived: { label: "مؤرشف", variant: "destructive" },
};

export default function NewsTable({ news, loading }: { news?: NewsResponse[]; loading?: boolean }) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!news?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        لا توجد أخبار. قم بإنشاء أول خبر الآن.
      </div>
    );
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`هل أنت متأكد من حذف الخبر: "${title}"؟`)) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        alert(json.error || "حدث خطأ أثناء الحذف");
        return;
      }
      router.refresh();
    } catch {
      alert("فشل الاتصال بالخادم");
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>العنوان</TableHead>
          <TableHead>التصنيف</TableHead>
          <TableHead>المنطقة</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>التاريخ</TableHead>
          <TableHead className="text-left">إجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {news.map((item, i) => (
          <TableRow key={item.id}>
            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
            <TableCell className="font-medium max-w-[250px] truncate">
              {item.title}
            </TableCell>
            <TableCell>{item.category.name}</TableCell>
            <TableCell>{item.region?.name ?? "—"}</TableCell>
            <TableCell>
              <Badge variant={statusLabels[item.status]?.variant ?? "secondary"}>
                {statusLabels[item.status]?.label ?? item.status}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {item.publishedAt
                ? new Date(item.publishedAt).toLocaleDateString("ar-SA")
                : "—"}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => router.push(`/news/${item.slug}/edit`)}
                >
                  تعديل
                </Button>
                <Button
                  variant="destructive"
                  size="xs"
                  onClick={() => handleDelete(item.id, item.title)}
                >
                  حذف
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
