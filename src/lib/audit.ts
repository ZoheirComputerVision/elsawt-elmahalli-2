import { prisma } from "@/lib/prisma";

export async function logAudit({
  action,
  entity,
  entityId,
  details,
  userId,
}: {
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  userId: string;
}) {
  await prisma.auditLog.create({
    data: { action, entity, entityId, details, userId },
  });
}
