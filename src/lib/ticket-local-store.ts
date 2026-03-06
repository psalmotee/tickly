export type TicketStatus = "open" | "in-progress" | "closed";

export type TicketPriority = "low" | "medium" | "high";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  userId: string;
  createdAt: string;
  updatedAt: string;
  internalNotes?: string;
  deletedByAdmin?: boolean;
}
