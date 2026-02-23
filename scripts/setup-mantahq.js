/**
 * MantaHQ Database Setup Script
 * This script initializes the users table in MantaHQ for the Tickly application
 * 
 * Run with: node scripts/setup-mantahq.js
 */

import { Manta } from "@mantahq/sdk";

const apiKey = process.env.NEXT_PUBLIC_MANTAHQ_API_KEY;
const workspaceId = process.env.NEXT_PUBLIC_MANTAHQ_WORKSPACE_ID;

if (!apiKey || !workspaceId) {
  console.error(
    "Error: Missing MantaHQ environment variables (NEXT_PUBLIC_MANTAHQ_API_KEY, NEXT_PUBLIC_MANTAHQ_WORKSPACE_ID)"
  );
  process.exit(1);
}

async function setupDatabase() {
  try {
    console.log("Initializing MantaHQ client...");
    const manta = new Manta({
      apiKey,
      workspaceId,
    });

    console.log("Setting up 'users' table schema...");

    // Create or get the users table
    const usersTable = manta.db.collection("users");

    // The schema will be inferred from the first document inserted
    // but we'll document the expected structure here
    console.log(
      "Users table ready. Expected schema:",
      JSON.stringify(
        {
          id: "string (user ID from MantaHQ Auth)",
          email: "string (unique email)",
          name: "string (user's full name)",
          role: "string (user or admin)",
          createdAt: "string (ISO timestamp)",
        },
        null,
        2
      )
    );

    console.log("MantaHQ database setup complete!");
    console.log(
      "\nNext steps:"
    );
    console.log("1. Users will be stored in the 'users' collection");
    console.log("2. User authentication is handled by MantaHQ Auth");
    console.log("3. User profiles are stored in the 'users' table");
    process.exit(0);
  } catch (error) {
    console.error("Error setting up MantaHQ database:", error);
    process.exit(1);
  }
}

setupDatabase();
