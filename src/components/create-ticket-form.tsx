"use client";

import type React from "react";

import { useState } from "react";
import { createTicket } from "@/lib/tickets";
import { getSession } from "@/lib/auth";
import { validateTicketForm } from "@/lib/validation";
import { FormError } from "./form-error";

interface CreateTicketFormProps {
  onSuccess: () => void;
}

export function CreateTicketForm({ onSuccess }: CreateTicketFormProps) {
  const session = getSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);

    const validation = validateTicketForm(title, description);

    if (!validation.isValid) {
      const errors: Record<string, string> = {};
      validation.errors.forEach((err) => {
        errors[err.field] = err.message;
      });
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    if (!session) {
      setError("Not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      createTicket(title, description, priority, session.user.id);
      onSuccess();
    } catch (err) {
      setError("Failed to create ticket");
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
          placeholder="Ticket title"
          className={`w-full rounded-lg border px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            fieldErrors.title
              ? "border-destructive bg-destructive/5"
              : "border-input bg-background"
          }`}
          disabled={isLoading}
        />
        {fieldErrors.title && (
          <p className="text-xs text-destructive mt-1">{fieldErrors.title}</p>
        )}
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
          placeholder="Ticket description"
          rows={4}
          className={`w-full rounded-lg border px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
            fieldErrors.description
              ? "border-destructive bg-destructive/5"
              : "border-input bg-background"
          }`}
          disabled={isLoading}
        />
        {fieldErrors.description && (
          <p className="text-xs text-destructive mt-1">
            {fieldErrors.description}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "low" | "medium" | "high")
          }
          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={isLoading}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Creating..." : "Create Ticket"}
      </button>
    </form>
  );
}
