"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider"; // Use this instead of getSession
import { isAdmin } from "@/lib/admin";
import { AdminHeader } from "@/components/admin-header";
import { AdminTicketList } from "@/components/admin-ticket-list";
import { AdminStats } from "@/components/admin-stats"; // Import your stats
import { getAllTickets } from "@/lib/tickets";

export default function AdminTicketsPage() {
  const router = useRouter();
  const { session, loading } = useAuth();

  // Redirect if not admin
  if (!loading && (!session || !isAdmin(session))) {
    router.push("/dashboard");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Calculate stats for the AdminStats component
  const allTickets = getAllTickets();
  const stats = {
    total: allTickets.length,
    open: allTickets.filter((t) => t.status === "open").length,
    inProgress: allTickets.filter((t) => t.status === "in-progress").length,
    closed: allTickets.filter((t) => t.status === "closed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Control Panel
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all system tickets and users
          </p>
        </div>

        {/* Add the Stats component here */}
        <div className="mb-8">
          <AdminStats {...stats} />
        </div>

        <AdminTicketList />
      </main>
    </div>
  );
}
