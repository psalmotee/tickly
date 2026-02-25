import { NextResponse } from "next/server";

const MANTA_BASE_URL =
  "https://api.mantahq.com/api/workflow/samsonmoradeyo/authentication/tickly-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Incoming body:", body); // DEBUG

    const mantaRes = await fetch(`${MANTA_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname: body.fullName,
        email: body.email,
        password: body.password,
        role: "user",
      }),
    });

    const data = await mantaRes.json();

    console.log("Manta response:", data); // DEBUG

    if (!mantaRes.ok) {
      return NextResponse.json(
        { success: false, error: data.message },
        { status: mantaRes.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Signup failed" },
      { status: 500 },
    );
  }
}
