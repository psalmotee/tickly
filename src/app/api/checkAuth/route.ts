import { NextResponse } from "next/server";
import { manta } from "@/lib/manta-server";

export async function GET() {
  try {
    const currentUser = await manta.auth.getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ success: false });
    }

    const userProfile = await manta.db
      .collection("users")
      .findOne({ email: currentUser.email });

    return NextResponse.json({
      success: true,
      session: {
        user: {
          id: currentUser.id,
          email: currentUser.email,
          name: userProfile?.fullname || currentUser.email,
          role: userProfile?.role || "user",
        },
        token: currentUser.token,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
