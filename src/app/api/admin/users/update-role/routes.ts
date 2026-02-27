import { NextResponse } from "next/server";
import { manta } from "@/lib/manta-server";
import type { FetchAllRecordsParams } from "mantahq-sdk/dist/types/api";

interface QueryMeta {
  page: number;
  list: number;
  total: number;
  totalPages: number;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const query = searchParams.get("query") || "";
  const limit = 10;

  try {
    const options: FetchAllRecordsParams = {
      table: "users",
      fields: ["id", "fullName", "email", "role", "createdAt"],
      page: page,
      list: limit,
      orderBy: "createdAt",
      order: "desc",
    };

    // If there is a search query, add the search parameter
    if (query) {
      options.search = {
        columns: ["fullName", "email"],
        query: query,
      };
    }

    const response = (await manta.fetchAllRecords(options)) as {
      data: unknown[];
      meta?: QueryMeta;
      status: boolean;
    };

    return NextResponse.json({
      success: true,
      users: response.data,
      meta: response.meta ?? null,
    });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
