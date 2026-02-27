import { NextResponse } from "next/server";
import { manta } from "@/lib/manta-server";

interface QueryMeta {
  page: number;
  list: number;
  total: number;
  totalPages: number;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10; // Number of users per page

  try {
    const response = (await manta.fetchAllRecords({
      table: "users",
      fields: ["id", "fullName", "email", "role", "createdAt"],
      page: page,
      list: limit,
      orderBy: "createdAt",
      order: "desc",
    })) as { data: unknown[]; meta?: QueryMeta; status: boolean };

    return NextResponse.json({
      success: true,
      users: response.data,
      meta: response.meta ?? null,
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
