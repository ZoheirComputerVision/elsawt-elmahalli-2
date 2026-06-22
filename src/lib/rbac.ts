import { auth } from "@/lib/auth";

export type Role = "ADMIN" | "EDITOR" | "REPORTER";

const roleHierarchy: Record<Role, number> = {
  REPORTER: 1,
  EDITOR: 2,
  ADMIN: 3,
};

export function roleLevel(role: string): number {
  return roleHierarchy[role as Role] ?? 0;
}

export function hasAccess(userRole: string, minimumRole: Role): boolean {
  return roleLevel(userRole) >= roleLevel(minimumRole);
}

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function requireRole(minimumRole: Role) {
  const user = await requireAuth();
  if (!hasAccess(user.role, minimumRole)) throw new Error("FORBIDDEN");
  return user;
}

export const Permissions = {
  ADMIN: ["CREATE_NEWS", "EDIT_NEWS", "REVIEW_NEWS", "PUBLISH_NEWS", "DELETE_NEWS", "MANAGE_USERS", "MANAGE_SETTINGS"] as const,
  EDITOR: ["CREATE_NEWS", "EDIT_NEWS", "REVIEW_NEWS", "PUBLISH_NEWS"] as const,
  REPORTER: ["CREATE_DRAFT"] as const,
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions][number];

const rolePermissions: Record<Role, readonly string[]> = {
  ADMIN: [...Permissions.ADMIN],
  EDITOR: [...Permissions.EDITOR],
  REPORTER: [...Permissions.REPORTER],
};

export function hasPermission(userRole: string, permission: string): boolean {
  const perms = rolePermissions[userRole as Role];
  if (!perms) return false;
  return perms.includes(permission);
}
