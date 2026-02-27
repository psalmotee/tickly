import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { manta } from "@/lib/manta-server";
import { resolveTicketTable } from "@/lib/manta-ticket-table";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const updates = await req.json();
    const ticketTable = await resolveTicketTable();

    const result = await manta.updateRecords({
      table: ticketTable,
      where: { id },
      data: updates,
    });

    if (!result.status) {
      return NextResponse.json(
        { success: false, error: "Failed to update ticket" },
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
