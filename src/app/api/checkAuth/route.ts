import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { manta } from "@/lib/manta-server";

interface TokenPayload {
  sub?: string;
  id?: string;
  userId?: string;
  email?: string;
  role?: string;
  fullName?: string;
  name?: string;
}

function normalizeRole(role?: string): "admin" | "user" {
  const value = role?.toLowerCase().trim();
  if (value === "admin" || value === "amin" || value === "administrator") {
    return "admin";
  }

  return "user";
}

function decodeJwtPayload(token: string): TokenPayload | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const json = Buffer.from(normalized, "base64").toString("utf-8");
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const payload = decodeJwtPayload(token);
    const email = payload?.email;

    if (!email) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const response = await manta.fetchAllRecords({
      table: "tickly-auth",
      where: { email },
      list: 1,
    });

    const userProfile =
      response.status && response.data.length > 0 ? response.data[0] : null;

    const userId =
      userProfile?.id ||
      userProfile?.user_id ||
      payload?.id ||
      payload?.userId ||
      payload?.sub;
    const userName = userProfile?.fullName
      ? userProfile.fullName
      : userProfile?.fullname
        ? userProfile.fullname
        : userProfile?.first_name
          ? `${userProfile.first_name} ${userProfile.last_name || ""}`.trim()
          : payload?.fullName || payload?.name || email;
    const profileRole =
      userProfile?.role || userProfile?.userRole || userProfile?.user_role;

    return NextResponse.json(
      {
        success: true,
        session: {
          user: {
            id: userId || email,
            email,
            fullName: userName,
            role: normalizeRole(profileRole || payload?.role),
          },
          token,
        },
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Auth Route Error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
