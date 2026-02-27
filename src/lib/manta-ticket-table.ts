import { manta } from "@/lib/manta-server";

const ENV_TICKET_TABLE = process.env.MANTA_TICKETS_TABLE;

const TICKET_TABLE_CANDIDATES = [
  ENV_TICKET_TABLE,
  "support-tickets",
  "support_tickets",
  "tickets",
  "ticket",
].filter(Boolean) as string[];

let cachedTicketTable: string | null = null;

export async function resolveTicketTable(): Promise<string> {
  if (cachedTicketTable) return cachedTicketTable;

  for (const table of TICKET_TABLE_CANDIDATES) {
    try {
      await manta.fetchAllRecords({ table, list: 1 });
      cachedTicketTable = table;
      return table;
    } catch {
      // try next candidate
    }
  }

  throw new Error(
    "No accessible ticket table found. Set MANTA_TICKETS_TABLE to an existing table (e.g. support-tickets) or create one in Manta dashboard.",
  );
}
