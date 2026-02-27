import { NextResponse } from "next/server";
import { manta } from "@/lib/manta-server";

const MANTA_BASE_URL =
  "https://api.mantahq.com/api/workflow/samsonmoradeyo/authentication/tickly-auth";

function normalizeRole(role?: string): "admin" | "user" {
  const value = role?.toLowerCase().trim();
  if (value === "admin" || value === "amin" || value === "administrator") {
    return "admin";
  }

  return "user";
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const mantaRes = await fetch(`${MANTA_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await mantaRes.json();
    console.log("Manta Login Error Detail:", data);

    if (!mantaRes.ok) {
      return NextResponse.json(
        { success: false, error: data.message },
        { status: mantaRes.status },
      );
    }

    const token = data.token;
    const profileRes = await manta.fetchAllRecords({
      table: "tickly-auth",
      where: { email },
      list: 1,
    });

    const userProfile =
      profileRes.status && profileRes.data.length > 0
        ? profileRes.data[0]
        : null;
    const userRole = normalizeRole(
      userProfile?.role || data.user?.role || data.role,
    );
    const userId = userProfile?.id || userProfile?.user_id || email;
    const fullName =
      userProfile?.fullName || userProfile?.fullname
        ? userProfile.fullName || userProfile.fullname
        : userProfile?.first_name
          ? `${userProfile.first_name} ${userProfile.last_name || ""}`.trim()
          : data.fullName || email;

    const response = NextResponse.json({
      success: true,
      session: {
        user: {
          id: userId,
          email: email,
          fullName,
          role: userRole,
        },
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 },
    );
  }
}
