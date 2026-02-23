// Admin utility functions

import type { AuthSession } from "./auth";

export function isAdmin(session: AuthSession | null): boolean {
  return session?.user.role === "admin";
}
