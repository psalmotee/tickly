"use client";

import { useRouter } from "next/navigation";
import { clearSession, getSession } from "@/lib/auth";
import { LogOut, Menu, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function AdminHeader() {
  const router = useRouter();
  const session = getSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  T
                </span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Tickly
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-4 pl-4 border-l border-border">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Admin Panel
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <nav className="flex items-center gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/tickets"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Tickets
              </Link>
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Users
              </Link>
            </nav>

            <div className="flex flex-col items-end">
              <p className="text-sm font-medium text-foreground">
                {session?.user.name}
              </p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-secondary transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden border-t border-border py-4 space-y-3">
            <nav className="flex flex-col gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/tickets"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Tickets
              </Link>
              <Link
                href="/admin/users"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                Users
              </Link>
            </nav>
            <div className="px-2 py-2 border-t border-border">
              <p className="text-sm font-medium text-foreground">
                {session?.user.name}
              </p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
