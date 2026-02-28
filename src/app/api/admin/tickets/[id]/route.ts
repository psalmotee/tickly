import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { manta } from "@/lib/manta-server";
import { resolveTicketTable } from "@/lib/manta-ticket-table";
import { markTicketDeletedByAdmin } from "@/lib/ticket-deletion";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const ticketTable = await resolveTicketTable();

    const response = await manta.fetchAllRecords({
      table: ticketTable,
      where: { id },
    });

    if (!response.status || response.data.length === 0) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const ticket = response.data[0] as { userId?: string } & Record<
      string,
      unknown
    >;

    const ticketUserId =
      (ticket.userId as string) ||
      (ticket.user_id as string) ||
      (ticket.userid as string) ||
      undefined;

    ticket.userId = ticketUserId;
    ticket.createdAt =
      (ticket.createdAt as string) ||
      (ticket.created_at as string) ||
      new Date().toISOString();
    ticket.updatedAt =
      (ticket.updatedAt as string) ||
      (ticket.updated_at as string) ||
      (ticket.createdAt as string);
    ticket.internalNotes =
      (ticket.internalNotes as string) ||
      (ticket.internal_notes as string) ||
      "";

    if (ticketUserId) {
      const userRes = await manta.fetchAllRecords({
        table: "tickly-auth",
        where: { id: ticketUserId },
        list: 1,
      });

      if (userRes.status && userRes.data.length > 0) {
        const user = userRes.data[0] as {
          fullname?: string;
          fullName?: string;
          email?: string;
          role?: string;
        };

        ticket.users = {
          fullName: user.fullName || user.fullname || "Unknown User",
          email: user.email || "",
          role: user.role || "user",
        };
      }
    }

    return NextResponse.json({ success: true, ticket });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { note } = await req.json();

  try {
    const { id } = await context.params;
    const ticketTable = await resolveTicketTable();

    const updateCandidates: Array<Record<string, unknown>> = [
      { internal_notes: note, updated_at: new Date().toISOString() },
      { internal_notes: note, updatedAt: new Date().toISOString() },
      { internalNotes: note },
      { internal_notes: note },
    ];

    let updated = false;

    for (const candidate of updateCandidates) {
      try {
        const result = await manta.updateRecords({
          table: ticketTable,
          where: { id },
          data: candidate,
        });

        if (result.status) {
          updated = true;
          break;
        }
      } catch {
        // Try next field variant.
      }
    }

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to save note" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const { status, softDelete } = (await req.json()) as {
      status?: "open" | "in-progress" | "closed";
      softDelete?: boolean;
    };

    const ticketTable = await resolveTicketTable();

    const ticketRes = await manta.fetchAllRecords({
      table: ticketTable,
      where: { id },
      list: 1,
    });

    if (!ticketRes.status || ticketRes.data.length === 0) {
      return NextResponse.json(
        { success: false, error: "Ticket not found" },
        { status: 404 },
      );
    }

    const existingTicket = ticketRes.data[0] as Record<string, unknown>;
    const existingNotes =
      (existingTicket.internal_notes as string) ||
      (existingTicket.internalNotes as string) ||
      "";

    const statusCandidates = status
      ? Array.from(
          new Set([
            status,
            status === "in-progress" ? "in_progress" : status,
            status === "closed" ? "resolved" : status,
          ]),
        )
      : [undefined];

    const notesValue = softDelete
      ? markTicketDeletedByAdmin(existingNotes)
      : undefined;

    const payloadCandidates: Record<string, unknown>[] = [];

    for (const statusValue of statusCandidates) {
      payloadCandidates.push({
        ...(statusValue ? { status: statusValue } : {}),
        ...(notesValue !== undefined ? { internal_notes: notesValue } : {}),
        updated_at: new Date().toISOString(),
      });
      payloadCandidates.push({
        ...(statusValue ? { status: statusValue } : {}),
        ...(notesValue !== undefined ? { internal_notes: notesValue } : {}),
        updatedAt: new Date().toISOString(),
      });
      payloadCandidates.push({
        ...(statusValue ? { status: statusValue } : {}),
        ...(notesValue !== undefined ? { internalNotes: notesValue } : {}),
      });
      payloadCandidates.push({
        ...(statusValue ? { status: statusValue } : {}),
        ...(notesValue !== undefined ? { internal_notes: notesValue } : {}),
      });
    }

    let updated = false;
    let lastError = "Failed to update ticket";

    for (const candidate of payloadCandidates) {
      if (Object.keys(candidate).length === 0) continue;

      try {
        const result = await manta.updateRecords({
          table: ticketTable,
          where: { id },
          data: candidate,
        });

        if (result.status) {
          updated = true;
          break;
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to update ticket";
        lastError = message;

        if (!message.includes("Unknown field")) {
          break;
        }
      }
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: lastError },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update ticket";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
