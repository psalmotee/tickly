import { NextResponse } from "next/server";
import { manta } from "@/lib/manta-server";
import { resolveTicketTable } from "@/lib/manta-ticket-table";
import { isTicketDeletedByAdmin } from "@/lib/ticket-deletion";

function mapTicketRecord(record: Record<string, unknown>) {
  const internalNotes =
    (record.internalNotes as string) || (record.internal_notes as string) || "";

  return {
    id: (record.id as string) || (record._id as string) || "",
    title: (record.title as string) || "",
    description: (record.description as string) || "",
    priority: (record.priority as string) || "medium",
    status: (record.status as string) || "open",
    userId:
      (record.userId as string) ||
      (record.user_id as string) ||
      (record.userid as string) ||
      "",
    createdAt:
      (record.createdAt as string) ||
      (record.created_at as string) ||
      new Date().toISOString(),
    updatedAt:
      (record.updatedAt as string) ||
      (record.updated_at as string) ||
      (record.createdAt as string) ||
      (record.created_at as string) ||
      new Date().toISOString(),
    internalNotes,
    deletedByAdmin: isTicketDeletedByAdmin(internalNotes),
  };
}

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

    const mergedTickets = new Map<string, ReturnType<typeof mapTicketRecord>>();
    const userIdFieldCandidates = ["user_id", "userId", "userid"];

    for (const userIdField of userIdFieldCandidates) {
      try {
        const response = await manta.fetchAllRecords({
          table: ticketTable,
          where: { [userIdField]: userId },
          orderBy: "created_at",
          order: "desc",
        });

        if (Array.isArray(response.data)) {
          for (const record of response.data) {
            const mapped = mapTicketRecord(record as Record<string, unknown>);
            const key = mapped.id || JSON.stringify(record);
            mergedTickets.set(key, mapped);
          }
        }
      } catch {
        // Keep trying possible user id field variants.
      }
    }

    const tickets = Array.from(mergedTickets.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({
      success: true,
      tickets,
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

    const payloadCandidates: Array<Record<string, unknown>> = [
      {
        title,
        description,
        priority,
        status: "open",
        user_id: userId,
      },
      {
        title,
        description,
        priority,
        status: "open",
        userId,
      },
      {
        title,
        description,
        priority,
        status: "open",
        userid: userId,
      },
      {
        title,
        description,
        priority,
        user_id: userId,
      },
      {
        title,
        description,
        priority,
        userId,
      },
    ];

    let lastError = "Failed to create ticket";

    for (const payload of payloadCandidates) {
      try {
        const createRes = await manta.createRecords({
          table: ticketTable,
          data: [payload],
        });

        const createSucceeded =
          Boolean((createRes as { success?: boolean }).success) ||
          Boolean((createRes as { status?: boolean }).status) ||
          (typeof (createRes as { message?: string }).message === "string" &&
            (createRes as { message?: string }).message
              ?.toLowerCase()
              .includes("successfully processed"));

        if (createSucceeded) {
          return NextResponse.json({
            success: true,
            ticket: mapTicketRecord(payload),
          });
        }

        lastError =
          (createRes as { message?: string }).message ||
          "Failed to create ticket";
        if (!lastError.includes("Unknown field")) {
          break;
        }
      } catch (candidateError: unknown) {
        const message =
          candidateError instanceof Error
            ? candidateError.message
            : "Failed to create ticket";

        lastError = message;
        if (!message.includes("Unknown field")) {
          break;
        }
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: lastError,
      },
      { status: 500 },
    );
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
