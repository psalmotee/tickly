"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login, saveSession } from "@/lib/auth";
import { validateLoginForm } from "@/lib/validation";
import { FormError } from "./form-error";
import { Eye } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminParam = searchParams.get("admin");
    setIsAdmin(adminParam === "true");
    if (adminParam === "true") {
      setEmail("admin@example.com");
      setPassword("admin123");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setIsLoading(true);

    const validation = validateLoginForm(email, password);

    if (!validation.isValid) {
      const errors: Record<string, string> = {};
      validation.errors.forEach((err) => {
        errors[err.field] = err.message;
      });
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = login(email, password);

    if (result.success && result.session) {
      saveSession(result.session);
      router.push(
        result.session.user.role === "admin" ? "/admin" : "/dashboard"
      );
    } else {
      setError(result.error || "Login failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-lg border border-border bg-card p-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {isAdmin ? "Admin Login" : "Welcome back"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {isAdmin
            ? "Sign in to your admin account"
            : "Sign in to your Tickly account"}
        </p>

        {error && <FormError message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                fieldErrors.email
                  ? "border-destructive bg-destructive/5"
                  : "border-input bg-background"
              }`}
              disabled={isLoading}
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-lg border px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  fieldErrors.password
                    ? "border-destructive bg-destructive/5"
                    : "border-input bg-background"
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-destructive mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isAdmin ? (
            <>
              Not an admin?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                User login
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {isAdmin ? "Admin Demo Credentials:" : "Demo Credentials:"}
        </p>
        {isAdmin ? (
          <>
            <p className="text-xs text-muted-foreground">
              Email: admin@example.com
            </p>
            <p className="text-xs text-muted-foreground">Password: admin123</p>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              Email: demo@example.com
            </p>
              <p className="text-xs text-muted-foreground">Password: demo123</p>
              <hr className="m-2"/>
            <p className="text-xs text-muted-foreground">
              Email: admin@example.com
            </p>
            <p className="text-xs text-muted-foreground">Password: admin123</p>
          </>
        )}
      </div>
    </div>
  );
}
