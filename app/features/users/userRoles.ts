import type { ApiUser } from "./usersApi";

const normalizeRole = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : null;

export const hasRole = (user: ApiUser, role: string) => {
  const appMetadata =
    user.app_metadata && typeof user.app_metadata === "object"
      ? (user.app_metadata as Record<string, unknown>)
      : null;
  const userMetadata =
    user.user_metadata && typeof user.user_metadata === "object"
      ? (user.user_metadata as Record<string, unknown>)
      : null;

  const metaRole =
    normalizeRole(appMetadata?.role) ?? normalizeRole(userMetadata?.role);
  if (metaRole === role) return true;

  const rolesValue = appMetadata?.roles ?? userMetadata?.roles;
  if (Array.isArray(rolesValue)) {
    return rolesValue.map(normalizeRole).some((r) => r === role);
  }

  return normalizeRole(rolesValue) === role;
};

export const filterUsersByRole = (users: ApiUser[], role: string) =>
  users.filter((u) => hasRole(u, role));

