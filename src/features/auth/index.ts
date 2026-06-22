import { auth } from "@/lib/auth";

export type Role = "ADMIN" | "EDITOR" | "REPORTER";

const ROLE_HIERARCHY: Record<Role, number> = {
  REPORTER: 1,
  EDITOR: 2,
  ADMIN: 3,
};

export function roleLevel(role: string): number {
  return ROLE_HIERARCHY[role as Role] ?? 0;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

export async function requireRole(minRole: Role) {
  const session = await auth();
  if (!session?.user) return null;
  if (roleLevel(session.user.role) < roleLevel(minRole)) return null;
  return session.user;
}
