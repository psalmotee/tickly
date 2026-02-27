import { NextResponse } from "next/server";
import { manta } from "@/lib/manta-server";

export async function PATCH(req: Request) {
  try {
    const { userId, newRole } = await req.json();

    if (!userId || (newRole !== "admin" && newRole !== "user")) {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 },
      );
    }

    const updateResponse = await manta.updateRecords({
      table: "tickly-auth",
      where: { id: userId },
      data: { role: newRole },
    });

    if (!updateResponse.status) {
      return NextResponse.json(
        { success: false, error: "Failed to update role" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update role";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
