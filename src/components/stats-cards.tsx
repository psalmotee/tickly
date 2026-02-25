"use client";

import { getTicketStats } from "@/lib/tickets";

import { useAuth } from "./auth-provider";
import { BarChart3, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export function StatsCards() {
  const { session } = useAuth();

  const stats = session?.user?.id
    ? getTicketStats(session.user.id)
    : { total: 0, open: 0, inProgress: 0, closed: 0 };

  const cards = [
    {
      label: "Total Tickets",
      value: stats.total,
      icon: BarChart3,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Open",
      value: stats.open,
      icon: AlertCircle,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      label: "Closed",
      value: stats.closed,
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {card.value}
                </p>
              </div>
              <div className={`rounded-lg p-3 ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
