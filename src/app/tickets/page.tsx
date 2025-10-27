"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { TicketList } from "@/components/ticket-list";
import { CreateTicketForm } from "@/components/create-ticket-form";
import { Modal } from "@/components/modal";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function TicketsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Tickets</h1>
            <p className="text-muted-foreground">
              Manage and track all your tickets
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Ticket
            </button>
            <Link
              href="/dashboard"
              className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <TicketList refreshTrigger={refreshTrigger} />
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Ticket"
      >
        <CreateTicketForm onSuccess={handleCreateSuccess} />
      </Modal>
    </main>
  );
}
