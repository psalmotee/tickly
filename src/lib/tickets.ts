// Ticket management utilities

export type TicketStatus = "open" | "in-progress" | "closed";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const TICKETS_STORAGE_KEY = "Tickly_tickets";

function getTickets(): Ticket[] {
  try {
    const tickets = localStorage.getItem(TICKETS_STORAGE_KEY);
    return tickets ? JSON.parse(tickets) : [];
  } catch {
    return [];
  }
}

function saveTickets(tickets: Ticket[]): void {
  localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
}

export function createTicket(
  title: string,
  description: string,
  priority: "low" | "medium" | "high",
  userId: string
): Ticket {
  const ticket: Ticket = {
    id: Math.random().toString(36).substring(2) + Date.now().toString(36),
    title,
    description,
    status: "open",
    priority,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId,
  };

  const tickets = getTickets();
  tickets.push(ticket);
  saveTickets(tickets);

  return ticket;
}

export function getTicketsByUser(userId: string): Ticket[] {
  return getTickets().filter((ticket) => ticket.userId === userId);
}

export function getTicketById(id: string): Ticket | undefined {
  return getTickets().find((ticket) => ticket.id === id);
}

export function updateTicket(
  id: string,
  updates: Partial<Ticket>
): Ticket | null {
  const tickets = getTickets();
  const index = tickets.findIndex((ticket) => ticket.id === id);

  if (index === -1) return null;

  tickets[index] = {
    ...tickets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveTickets(tickets);
  return tickets[index];
}

export function deleteTicket(id: string): boolean {
  const tickets = getTickets();
  const filtered = tickets.filter((ticket) => ticket.id !== id);

  if (filtered.length === tickets.length) return false;

  saveTickets(filtered);
  return true;
}

export function getTicketStats(userId: string) {
  const tickets = getTicketsByUser(userId);

  return {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };
}

export function getAllTickets(): Ticket[] {
  return getTickets();
}

export function getAllTicketsStats() {
  const tickets = getTickets();

  const userStats: Record<
    string,
    { name: string; count: number; open: number; closed: number }
  > = {};

  tickets.forEach((ticket) => {
    if (!userStats[ticket.userId]) {
      userStats[ticket.userId] = {
        name: ticket.userId,
        count: 0,
        open: 0,
        closed: 0,
      };
    }
    userStats[ticket.userId].count++;
    if (ticket.status === "open") userStats[ticket.userId].open++;
    if (ticket.status === "closed") userStats[ticket.userId].closed++;
  });

  return {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    closed: tickets.filter((t) => t.status === "closed").length,
    byUser: Object.values(userStats).sort((a, b) => b.count - a.count),
  };
}
