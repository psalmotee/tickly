"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MantaClient } from "mantahq-sdk";
import type { AuthSession, User } from "@/lib/auth";

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  setSession: (session: AuthSession | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  setSession: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated via MantaHQ
    const checkAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const manta = new MantaClient({
            sdkKey: process.env.NEXT_PUBLIC_MANTAHQ_SDK_KEY!,
          });

          const currentUser = await manta.auth.getCurrentUser();

          if (currentUser) {
            // Fetch user profile from database
            const usersTable = manta.db.collection("users");
            const userProfile = await usersTable.findOne({
              email: currentUser.email,
            });

            const newSession: AuthSession = {
              user: {
                id: currentUser.id,
                email: currentUser.email,
                name: userProfile?.name || currentUser.email,
                role: userProfile?.role || "user",
              },
              token: currentUser.token || "",
            };

            setSession(newSession);
          }
        }
      } catch (error) {
        console.error("[v0] Auth check error:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage =
      pathname === "/login" || pathname === "/signup" || pathname === "/";

    if (!session && !isAuthPage) {
      router.push("/login");
    }

    if (session && isAuthPage && pathname !== "/") {
      router.push(session.user.role === "admin" ? "/admin" : "/dashboard");
    }

    const isAdminPage = pathname.startsWith("/admin");
    if (session && isAdminPage && session.user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [pathname, router, session, loading]);

  return (
    <AuthContext.Provider value={{ session, loading, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}
