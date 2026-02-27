import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { manta } from "@/lib/manta-server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const response = await manta.fetchAllRecords({
      table: "support-tickets",
      where: { id },
      with: {
        users: {
          fields: ["fullName", "email", "role"],
          on: { from: "userId", to: "id" },
        },
      },
    });

    if (!response.status || response.data.length === 0) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket: response.data[0] });
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

    await manta.updateRecords({
      table: "support-tickets",
      where: { id },
      data: { internalNotes: note },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
