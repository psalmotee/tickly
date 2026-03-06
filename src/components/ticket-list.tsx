"use client";

import { useState, useEffect, useCallback } from "react";
import { type Ticket } from "@/lib/ticket-local-store";
import { TicketCard } from "./ticket-card";
import { toast } from "react-toastify";
import { useAuth } from "./auth-provider";

interface TicketListProps {
  refreshTrigger: number;
  latestCreatedTicket?: Ticket | null;
  onCreatedTicketConsumed?: () => void;
}

export function TicketList({
  refreshTrigger,
  latestCreatedTicket,
  onCreatedTicketConsumed,
}: TicketListProps) {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const loadTickets = useCallback(
    async (targetUserId?: string) => {
      const activeUserId = targetUserId || userId;
      if (!activeUserId) return;

      try {
        const res = await fetch(`/api/tickets?userId=${activeUserId}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data.success) {
          setTickets(data.tickets || []);
        } else {
          toast.error(data.error || "Failed to load tickets");
        }
      } catch (error: unknown) {
        console.error("[ticket-list] Failed to load tickets", { error });
        toast.error("Failed to load tickets");
      }
    },
    [userId],
  );

  useEffect(() => {
    if (!userId) return;

    const timer = setTimeout(() => {
      void loadTickets(userId);
    }, 0);

    return () => clearTimeout(timer);
  }, [refreshTrigger, userId, loadTickets]);

  useEffect(() => {
    if (!latestCreatedTicket) return;

    const optimisticTimer = setTimeout(() => {
      setTickets((prev) => {
        const exists = prev.some(
          (ticket) => ticket.id === latestCreatedTicket.id,
        );
        if (exists) return prev;
        return [latestCreatedTicket, ...prev];
      });
    }, 0);

    const syncTimer = setTimeout(() => {
      if (userId) {
        void loadTickets(userId);
      }
      onCreatedTicketConsumed?.();
    }, 1200);

    return () => {
      clearTimeout(optimisticTimer);
      clearTimeout(syncTimer);
    };
  }, [latestCreatedTicket, onCreatedTicketConsumed, userId, loadTickets]);

  if (tickets.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground mb-4">
          No tickets yet. Create one to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
