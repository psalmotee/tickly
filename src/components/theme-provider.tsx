"use client";

import type { Ticket } from "@/lib/tickets";
import { Trash2, Edit2, CheckCircle2 } from "lucide-react";

interface TicketCardProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
}

export function TicketCard({ ticket, onEdit, onDelete }: TicketCardProps) {
  const statusColors = {
    open: "bg-amber-500/10 text-amber-700 border-amber-200",
    "in-progress": "bg-blue-500/10 text-blue-700 border-blue-200",
    closed: "bg-green-500/10 text-green-700 border-green-200",
  };

  const priorityColors = {
    low: "text-gray-600",
    medium: "text-amber-600",
    high: "text-red-600",
  };

  const getStatusDisplay = () => {
    if (ticket.status === "closed") {
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${
            statusColors[ticket.status]
          }`}
        >
          <CheckCircle2 className="h-3 w-3" />
          Resolved
        </span>
      );
    }
    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
          statusColors[ticket.status]
        }`}
      >
        {ticket.status === "in-progress"
          ? "In Progress"
          : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
      </span>
    );
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">
            {ticket.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {ticket.description}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(ticket)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground"
            title="Edit ticket"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(ticket.id)}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
            title="Delete ticket"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {getStatusDisplay()}
        <span
          className={`text-xs font-medium ${priorityColors[ticket.priority]}`}
        >
          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}{" "}
          Priority
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
