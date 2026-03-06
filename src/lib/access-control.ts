import type { AuthSession } from "./auth-client";

export function isAdmin(session: AuthSession | null): boolean {
  return session?.user.role === "admin";
}
