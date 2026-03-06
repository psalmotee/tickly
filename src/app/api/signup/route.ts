import { NextResponse } from "next/server";

const MANTA_BASE_URL =
  "https://api.mantahq.com/api/workflow/samsonmoradeyo/authentication/tickly-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch((parseError: unknown) => {
      console.error("[signup] Invalid JSON body", { parseError });
      return null;
    });

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body. Expected JSON." },
        { status: 400 },
      );
    }

    const { fullName, email, password } = body as {
      fullName?: unknown;
      email?: unknown;
      password?: unknown;
    };

    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "fullName, email, and password are required.",
        },
        { status: 400 },
      );
    }

    const mantaRes = await fetch(`${MANTA_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname: fullName,
        email,
        password,
        role: "user",
      }),
    });

    const data = await mantaRes.json().catch((parseError: unknown) => {
      console.error("[signup] Failed to parse signup response JSON", {
        parseError,
      });
      return {} as Record<string, unknown>;
    });

    if (!mantaRes.ok) {
      const errorMessage =
        typeof (data as { message?: unknown }).message === "string"
          ? ((data as { message: string }).message ?? "Signup failed")
          : "Signup failed";

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: mantaRes.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[signup] Unexpected signup route error", { error });
    return NextResponse.json(
      { success: false, error: "Signup failed" },
      { status: 500 },
    );
  }
}
