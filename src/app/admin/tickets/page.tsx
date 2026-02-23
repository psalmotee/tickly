"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { AdminHeader } from "@/components/admin-header";
import { AdminTicketList } from "@/components/admin-ticket-list";
import { useAuth } from "@/components/auth-provider";

export default function AdminTicketsPage() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!session || !isAdmin(session)) {
      router.push("/dashboard");
      return;
    }
    setIsLoading(false);
  }, [router, session, loading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Tickets</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all tickets in the system
          </p>
        </div>

        <AdminTicketList />
      </main>
    </div>
  );
}
