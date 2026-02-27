import { NextResponse } from "next/server";
import { manta } from "@/lib/manta-server";

export async function GET() {
  try {
    const response = await manta.fetchAllRecords({
      table: "support-tickets",
      fields: ["id", "title", "description", "status", "priority", "createdAt"],
      with: {
        users: {
          fields: ["fullName", "email"],
          on: { from: "userId", to: "id" }, // Links ticket.userId to user.id
        },
      },
      orderBy: "createdAt",
      order: "desc",
    });

    return NextResponse.json({
      success: true,
      tickets: response.data,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
