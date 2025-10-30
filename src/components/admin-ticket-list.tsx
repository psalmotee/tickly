"use client";

import { useState, useEffect } from "react";
import {
  getAllTickets,
  updateTicket,
  deleteTicket,
  type Ticket,
} from "@/lib/tickets";
import { Modal } from "./modal";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import { Trash2, ChevronDown, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify"; // ✅ import toast

export function AdminTicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    ticket: Ticket | null;
  }>({
    isOpen: false,
    ticket: null,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    setTickets(getAllTickets());
  };

  const handleStatusChange = (
    ticket: Ticket,
    status: "open" | "in-progress" | "closed"
  ) => {
    updateTicket(ticket.id, { status });
    loadTickets();
    setEditingId(null);
    toast.success(`Ticket marked as ${getStatusLabel(status)} ✅`); // ✅ Toast for status change
  };

  const handleDeleteClick = (ticket: Ticket) => {
    setDeleteModal({ isOpen: true, ticket });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.ticket) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    deleteTicket(deleteModal.ticket.id);
    loadTickets();
    setDeleteModal({ isOpen: false, ticket: null });
    setIsLoading(false);
    toast.success("Ticket deleted successfully 🗑️"); // ✅ Toast for delete success
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-amber-500/10 text-amber-700 border-amber-200";
      case "in-progress":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "closed":
        return "bg-green-500/10 text-green-700 border-green-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-amber-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "closed") return "Resolved";
    if (status === "in-progress") return "In Progress";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  User
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No tickets found
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-border hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {ticket.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {ticket.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {ticket.userId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setEditingId(
                              editingId === ticket.id ? null : ticket.id
                            )
                          }
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status === "closed" && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          {getStatusLabel(ticket.status)}
                          <ChevronDown className="h-3 w-3" />
                        </button>
                        {editingId === ticket.id && (
                          <div className="absolute top-full mt-1 left-0 z-10 rounded-lg border border-border bg-card shadow-lg">
                            {(["open", "in-progress", "closed"] as const).map(
                              (status) => (
                                <button
                                  key={status}
                                  onClick={() =>
                                    handleStatusChange(ticket, status)
                                  }
                                  className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary first:rounded-t-lg last:rounded-b-lg transition-colors"
                                >
                                  {getStatusLabel(status)}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium capitalize ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteClick(ticket)}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, ticket: null })}
        title="Delete Ticket"
      >
        {deleteModal.ticket && (
          <DeleteConfirmationModal
            title="Delete Ticket"
            description="Are you sure you want to delete this ticket?"
            itemName={deleteModal.ticket.title}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteModal({ isOpen: false, ticket: null })}
            isLoading={isLoading}
          />
        )}
      </Modal>
    </>
  );
}
