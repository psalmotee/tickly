import { NextResponse } from "next/server";

const MANTA_BASE_URL =
  "https://api.mantahq.com/api/workflow/samsonmoradeyo/authentication/tickly-auth";

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
    const userRole = data.user?.role || data.role || "user";
    console.log("Manta Login Error Detail:", data);

    if (!mantaRes.ok) {
      return NextResponse.json(
        { success: false, error: data.message },
        { status: mantaRes.status },
      );
    }

    // Assuming manta returns token
    const token = data.token;

    const response = NextResponse.json({
      success: true,
      session: {
        user: {
          email: email,
          fullName: data.fullName || null,
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
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 },
    );
  }
}
