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
    user: (record.user as Record<string, unknown> | undefined) || null,
  };
}

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
        "created_at",
        "user_id",
        "updated_at",
        "internal_notes",
      ],
      orderBy: "created_at",
      order: "desc",
    });

    const mappedTickets = Array.isArray(response.data)
      ? response.data.map((record) =>
          mapTicketRecord(record as Record<string, unknown>),
        )
      : [];

    const userIds = Array.from(
      new Set(mappedTickets.map((ticket) => ticket.userId).filter(Boolean)),
    );

    const usersById = new Map<string, { fullName: string; email: string }>();

    await Promise.all(
      userIds.map(async (userId) => {
        try {
          const userRes = await manta.fetchAllRecords({
            table: "tickly-auth",
            where: { id: userId },
            list: 1,
          });

          if (!userRes.status || userRes.data.length === 0) {
            const fallbackUserRes = await manta.fetchAllRecords({
              table: "tickly-auth",
              where: { user_id: userId },
              list: 1,
            });

            if (fallbackUserRes.status && fallbackUserRes.data.length > 0) {
              const fallbackUser = fallbackUserRes.data[0] as {
                fullName?: string;
                fullname?: string;
                email?: string;
              };

              usersById.set(userId, {
                fullName:
                  fallbackUser.fullName ||
                  fallbackUser.fullname ||
                  "Unknown User",
                email: fallbackUser.email || "",
              });
            }

            return;
          }

          if (userRes.status && userRes.data.length > 0) {
            const user = userRes.data[0] as {
              fullName?: string;
              fullname?: string;
              email?: string;
            };

            usersById.set(userId, {
              fullName: user.fullName || user.fullname || "Unknown User",
              email: user.email || "",
            });
          }
        } catch {
          // Skip per-user enrichment failure
        }
      }),
    );

    return NextResponse.json({
      success: true,
      tickets: mappedTickets.map((ticket) => ({
        ...ticket,
        user: usersById.get(ticket.userId) || null,
      })),
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
