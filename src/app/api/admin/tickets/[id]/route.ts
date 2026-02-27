import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { manta } from "@/lib/manta-server";
import { resolveTicketTable } from "@/lib/manta-ticket-table";

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

    if (ticket.userId) {
      const userRes = await manta.fetchAllRecords({
        table: "tickly-auth",
        where: { id: ticket.userId },
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

    await manta.updateRecords({
      table: ticketTable,
      where: { id },
      data: { internalNotes: note },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
