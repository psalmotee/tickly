"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const session = getSession();
    const isAuthPage =
      pathname === "/login" || pathname === "/signup" || pathname === "/";

    if (!session && !isAuthPage) {
      router.push("/login");
    }

    if (session && isAuthPage && pathname !== "/") {
      router.push("/dashboard");
    }

    const isAdminPage = pathname.startsWith("/admin");
    if (session && isAdminPage && !isAdmin(session)) {
      router.push("/dashboard");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
