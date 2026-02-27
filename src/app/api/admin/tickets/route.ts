import { NextResponse } from "next/server";
import { manta } from "@/lib/manta-server";
import { resolveTicketTable } from "@/lib/manta-ticket-table";

export async function GET() {
  try {
    const ticketTable = await resolveTicketTable();

    const response = await manta.fetchAllRecords({
      table: ticketTable,
      fields: [
        "id",
        "title",
        "description",
        "status",
        "priority",
        "createdAt",
        "userId",
      ],
      orderBy: "createdAt",
      order: "desc",
    });

    return NextResponse.json({
      success: true,
      tickets: response.data,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch tickets";

    if (
      typeof message === "string" &&
      (message.includes("Table not found") ||
        message.includes("No accessible ticket table found"))
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Ticket table is not available for this SDK key. Set MANTA_TICKETS_TABLE in .env to an existing Manta table.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
