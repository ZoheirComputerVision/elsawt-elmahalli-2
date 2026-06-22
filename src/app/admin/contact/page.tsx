import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const typeLabels: Record<string, string> = {
  general: "تواصل عام", news_tip: "اقتراح خبر", correction: "تصحيح خبر", report: "بلاغ محلي",
};

async function markAsRead(id: string) {
  "use server";
  await prisma.contactMessage.update({ where: { id }, data: { read: true } });
}

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-xl font-bold text-navy mb-6">رسائل التواصل</h1>

      <div className="space-y-3">
        {messages.map((msg) => (
          <form key={msg.id} action={markAsRead.bind(null, msg.id)} className={`border rounded-sm p-4 ${msg.read ? "border-gray-200 bg-white" : "border-gold/30 bg-gold/5"}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-[10px] bg-navy/10 text-navy font-bold px-2 py-0.5 rounded-sm">
                  {typeLabels[msg.type] ?? msg.type}
                </span>
                {!msg.read && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-sm mr-2">جديد</span>}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {msg.createdAt.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-sm font-bold text-navy">{msg.name}</p>
            <div className="flex gap-3 text-[11px] text-muted-foreground mb-2">
              <span>{msg.email}</span>
              {msg.phone && <span>{msg.phone}</span>}
            </div>
            {msg.subject && <p className="text-xs text-navy font-semibold mb-1">الموضوع: {msg.subject}</p>}
            <p className="text-xs text-gray-600 leading-relaxed">{msg.message}</p>
            {!msg.read && (
              <button type="submit" className="text-[10px] text-gold hover:text-navy font-bold mt-2 transition-colors">
                وضع كمقروء
              </button>
            )}
          </form>
        ))}
        {messages.length === 0 && (
          <p className="text-center py-12 text-sm text-muted-foreground">لا توجد رسائل بعد</p>
        )}
      </div>
    </div>
  );
}
