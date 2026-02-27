import { NextResponse } from "next/server";
import { manta } from "@/lib/manta-server";
import { resolveTicketTable } from "@/lib/manta-ticket-table";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "userId is required" },
      { status: 400 },
    );
  }

  try {
    const ticketTable = await resolveTicketTable();

    const response = await manta.fetchAllRecords({
      table: ticketTable,
      where: { userId },
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
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, priority, userId } = await req.json();

    if (!title || !description || !priority || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const ticketTable = await resolveTicketTable();

    const payload = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      status: "open",
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const createRes = await manta.createRecords({
      table: ticketTable,
      data: [payload],
      options: {
        validationRule: {
          title: { required: true, minLength: 3 },
          description: { required: true, minLength: 5 },
          priority: { required: true, enum: ["low", "medium", "high"] },
          userId: { required: true },
        },
      },
    });

    if (!createRes.success) {
      return NextResponse.json(
        {
          success: false,
          error: createRes.message || "Failed to create ticket",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, ticket: payload });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create ticket";

    if (
      typeof message === "string" &&
      (message.includes("Table not found") ||
        message.includes("No accessible ticket table found"))
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Ticket table is not available for this SDK key. Configure MANTA_TICKETS_TABLE in .env to an existing Manta table and restart dev server.",
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
