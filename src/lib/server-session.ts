import { cookies } from "next/headers";
import { manta } from "@/lib/manta-client";

interface TokenPayload {
  sub?: string;
  id?: string;
  userId?: string;
  email?: string;
  role?: string;
}

export interface ApiSessionUser {
  id: string;
  email: string;
  role: "admin" | "user";
}

function normalizeRole(role?: string): "admin" | "user" {
  const value = role?.toLowerCase().trim();
  if (value === "admin" || value === "administrator") {
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

export async function getRequestSessionUser(): Promise<ApiSessionUser | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  const email = payload?.email;
  if (!email) return null;

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
    payload?.sub ||
    email;

  return {
    id: userId,
    email,
    role: normalizeRole(
      userProfile?.role ||
        userProfile?.userRole ||
        userProfile?.user_role ||
        payload?.role,
    ),
  };
}
