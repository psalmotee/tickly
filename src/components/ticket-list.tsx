"use client";

import { useState, useEffect } from "react";
import { getTicketsByUser, deleteTicket, type Ticket } from "@/lib/tickets";
import { getSession } from "@/lib/auth";
import { TicketCard } from "./ticket-card";
import { Modal } from "./modal";
import { EditTicketForm } from "./edit-ticket-form";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";

interface TicketListProps {
  refreshTrigger: number;
}

export function TicketList({ refreshTrigger }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setTickets(getTicketsByUser(session.user.id));
    }
  }, [refreshTrigger]);

  const handleEdit = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedTicket) return;
    setIsDeleting(true);
    deleteTicket(selectedTicket.id);
    const session = getSession();
    if (session) {
      setTickets(getTicketsByUser(session.user.id));
    }
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setSelectedTicket(null);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedTicket(null);
    const session = getSession();
    if (session) {
      setTickets(getTicketsByUser(session.user.id));
    }
  };

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
    <>
      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onEdit={handleEdit}
            onDelete={() => handleDeleteClick(ticket)}
          />
        ))}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Ticket"
      >
        {selectedTicket && (
          <EditTicketForm
            ticket={selectedTicket}
            onSuccess={handleEditSuccess}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Ticket"
      >
        {selectedTicket && (
          <DeleteConfirmationModal
            title="Delete Ticket"
            description="Are you sure you want to delete this ticket?"
            itemName={selectedTicket?.title || ""}
            onConfirm={handleConfirmDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
            isLoading={isDeleting}
          />
        )}
      </Modal>
    </>
  );
}
