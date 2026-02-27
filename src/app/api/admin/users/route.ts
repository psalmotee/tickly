import { NextResponse } from "next/server";
import { manta } from "@/lib/manta-server";
import type { FetchAllRecordsParams } from "mantahq-sdk/dist/types/api";

interface QueryMeta {
  page: number;
  list: number;
  total: number;
  totalPages: number;
}

interface RawUserRecord {
  id?: string;
  user_id?: string;
  email?: string;
  fullName?: string;
  fullname?: string;
  first_name?: string;
  last_name?: string;
  role?: "admin" | "user";
  createdAt?: string;
}

function normalizeRole(role?: string): "admin" | "user" {
  const value = role?.toLowerCase().trim();
  if (value === "admin" || value === "amin" || value === "administrator") {
    return "admin";
  }

  return "user";
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const query = searchParams.get("query") || "";
  const limit = 10;

  try {
    const options: FetchAllRecordsParams = {
      table: "tickly-auth",
      fields: ["id", "fullname", "email", "role", "createdAt"],
      page,
      list: limit,
      orderBy: "createdAt",
      order: "desc",
    };

    if (query) {
      options.search = {
        columns: ["fullname", "email"],
        query,
      };
    }

    const response = (await manta.fetchAllRecords(options)) as {
      status: boolean;
      data: RawUserRecord[];
      meta?: QueryMeta;
    };

    const users = (response.data || []).map((user) => ({
      id: user.id || user.user_id || "",
      email: user.email || "",
      fullName:
        user.fullName ||
        user.fullname ||
        (user.first_name
          ? `${user.first_name} ${user.last_name || ""}`.trim()
          : ""),
      role: normalizeRole(user.role),
      createdAt: user.createdAt || null,
    }));

    return NextResponse.json({
      success: true,
      users,
      meta: response.meta ?? null,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
