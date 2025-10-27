"use client";

import { BarChart3, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface AdminStatsProps {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
}

export function AdminStats({
  total,
  open,
  inProgress,
  closed,
}: AdminStatsProps) {
  const stats = [
    {
      label: "Total Tickets",
      value: total,
      icon: BarChart3,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Open",
      value: open,
      icon: AlertCircle,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Closed",
      value: closed,
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
