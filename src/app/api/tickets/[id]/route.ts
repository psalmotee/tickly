import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { manta } from "@/lib/manta-server";
import { resolveTicketTable } from "@/lib/manta-ticket-table";
import { isTicketDeletedByAdmin } from "@/lib/ticket-deletion";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const updates = await req.json();
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

    if (isTicketDeletedByAdmin(existingNotes)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This ticket was deleted by admin and can no longer be modified",
        },
        { status: 403 },
      );
    }

    const normalizedUpdates: Record<string, unknown> = {
      ...(updates.title !== undefined ? { title: updates.title } : {}),
      ...(updates.description !== undefined
        ? { description: updates.description }
        : {}),
      ...(updates.status !== undefined ? { status: updates.status } : {}),
      ...(updates.priority !== undefined ? { priority: updates.priority } : {}),
      ...(updates.userId !== undefined ? { user_id: updates.userId } : {}),
      ...(updates.user_id !== undefined ? { user_id: updates.user_id } : {}),
      ...(updates.internalNotes !== undefined
        ? { internal_notes: updates.internalNotes }
        : {}),
      ...(updates.internal_notes !== undefined
        ? { internal_notes: updates.internal_notes }
        : {}),
    };

    const updateCandidates: Record<string, unknown>[] = [
      { ...normalizedUpdates, updated_at: new Date().toISOString() },
      { ...normalizedUpdates, updatedAt: new Date().toISOString() },
      normalizedUpdates,
    ];

    let result: { status: boolean } | null = null;
    let lastError = "Failed to update ticket";

    for (const candidate of updateCandidates) {
      if (Object.keys(candidate).length === 0) continue;

      try {
        const candidateResult = await manta.updateRecords({
          table: ticketTable,
          where: { id },
          data: candidate,
        });

        if (candidateResult.status) {
          result = candidateResult;
          break;
        }

        lastError = "Failed to update ticket";
      } catch (candidateError: unknown) {
        const message =
          candidateError instanceof Error
            ? candidateError.message
            : "Failed to update ticket";
        lastError = message;

        if (!message.includes("Unknown field")) {
          break;
        }
      }
    }

    if (!result?.status) {
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

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
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

    if (isTicketDeletedByAdmin(existingNotes)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This ticket was deleted by admin and can no longer be accessed",
        },
        { status: 403 },
      );
    }

    const result = await manta.deleteRecords({
      table: ticketTable,
      where: { id },
    });

    if (!result.status) {
      return NextResponse.json(
        { success: false, error: "Failed to delete ticket" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete ticket";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
