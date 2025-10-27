"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/auth";
import { Shield, User } from "lucide-react";

export function AdminUsersList() {
  const [users, setUsers] = useState<
    Array<{ email: string; name: string; role: "user" | "admin" }>
  >([]);

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                Role
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.email}
                  className="border-b border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-foreground">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-1">
                      {user.role === "admin" ? (
                        <>
                          <Shield className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-primary">
                            Admin
                          </span>
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            User
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700">
                      Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
