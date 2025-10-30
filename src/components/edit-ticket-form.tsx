"use client";

import type React from "react";

import { useState } from "react";
import { updateTicket, type Ticket, type TicketStatus } from "@/lib/tickets";
import { AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { FormError } from "./form-error";

interface EditTicketFormProps {
  ticket: Ticket;
  onSuccess: () => void;
}

export function EditTicketForm({ ticket, onSuccess }: EditTicketFormProps) {
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!title.trim()) {
      setError("Title is required");
      setIsLoading(false);
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      setIsLoading(false);
      return;
    }

    try {
      updateTicket(ticket.id, { title, description, status, priority });
      toast.success("Ticket updated successfully!");
      onSuccess();
    } catch (err) {
      setError("Failed to update ticket");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <FormError message={error} />}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={isLoading}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Updating..." : "Update Ticket"}
      </button>
    </form>
  );
}
