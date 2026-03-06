export const ADMIN_DELETED_MARKER = "__deleted_by_admin__";

export function isTicketDeletedByAdmin(internalNotes?: string): boolean {
  return (internalNotes || "").includes(ADMIN_DELETED_MARKER);
}

export function markTicketDeletedByAdmin(
  previousNotes?: string,
  deletedAtIso?: string,
): string {
  const base = (previousNotes || "").trim();
  const timestamp = deletedAtIso || new Date().toISOString();
  const marker = `${ADMIN_DELETED_MARKER}:${timestamp}`;

  if (!base) return marker;
  if (base.includes(ADMIN_DELETED_MARKER)) return base;

  return `${base}\n${marker}`;
}
