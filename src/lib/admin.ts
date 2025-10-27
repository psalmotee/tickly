// Admin utility functions

import { getSession, type AuthSession } from "./auth";

export function isAdmin(session: AuthSession | null): boolean {
  return session?.user.role === "admin";
}

export function checkAdminAccess(): boolean {
  const session = getSession();
  return isAdmin(session);
}
