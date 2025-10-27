// Authentication utility functions using localStorage

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface AuthSession {
  user: User;
  token: string;
}

const STORAGE_KEY = "Tickly_session";

export function saveSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  try {
    const session = localStorage.getItem(STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
}

// Mock user database (in real app, this would be a backend)
const users: Map<
  string,
  { email: string; password: string; name: string; role: "user" | "admin" }
> = new Map();

// Initialize with demo admin account
if (typeof window !== "undefined") {
  const existingUsers = localStorage.getItem("Tickly_users");
  if (!existingUsers) {
    users.set("admin@example.com", {
      email: "admin@example.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
    });
    users.set("demo@example.com", {
      email: "demo@example.com",
      password: "demo123",
      name: "Demo User",
      role: "user",
    });
  }
}

export function signup(
  email: string,
  password: string,
  name: string
): { success: boolean; error?: string } {
  if (users.has(email)) {
    return { success: false, error: "Email already registered" };
  }

  users.set(email, { email, password, name, role: "user" });
  return { success: true };
}

export function login(
  email: string,
  password: string
): { success: boolean; session?: AuthSession; error?: string } {
  const user = users.get(email);

  if (!user || user.password !== password) {
    return { success: false, error: "Invalid email or password" };
  }

  const session: AuthSession = {
    user: {
      id: email,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token: generateToken(),
  };

  return { success: true, session };
}

export function getAllUsers(): Array<{
  email: string;
  name: string;
  role: "user" | "admin";
}> {
  return Array.from(users.values()).map(({ email, name, role }) => ({
    email,
    name,
    role,
  }));
}
