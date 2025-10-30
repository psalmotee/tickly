"use client";

import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";
import { StatsCards } from "@/components/stats-cards";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here is an overview of your tickets.
          </p>
        </div>

        <StatsCards />

        <div className="mt-12">
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Ready to manage your tickets?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create, view, and manage all your tickets in one place.
            </p>
            <Link
              href="/tickets"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Go to Tickets
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
