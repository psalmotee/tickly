// Authentication utility functions using MantaHQ
import { MantaClient } from "mantahq-sdk";

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

// Initialize MantaHQ SDK
let mantaClient: MantaClient | null = null;

function getMantaClient(): MantaClient {
  if (!mantaClient && typeof window !== "undefined") {
    mantaClient = new MantaClient({
      sdkKey: process.env.NEXT_PUBLIC_MANTAHQ_SDK_KEY!,
    });
  }
  return mantaClient!;
}

export async function signup(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const manta = getMantaClient();

    // Create user account with MantaHQ
    const authResponse = await manta.auth.signUp({
      email,
      password,
    });

    if (!authResponse.user) {
      return { success: false, error: "Failed to create account" };
    }

    // Store additional user data in MantaHQ database
    const usersTable = manta.db.collection("users");
    await usersTable.insert({
      id: authResponse.user.id,
      email,
      name,
      role: "user",
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("[v0] Signup error:", error);
    return {
      success: false,
      error:
        error?.message ||
        "Signup failed. Please try again.",
    };
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  try {
    const manta = getMantaClient();

    // Sign in with MantaHQ
    const authResponse = await manta.auth.signIn({
      email,
      password,
    });

    if (!authResponse.user || !authResponse.token) {
      return { success: false, error: "Invalid email or password" };
    }

    // Fetch user profile from database
    const usersTable = manta.db.collection("users");
    const userProfile = await usersTable.findOne({ email });

    const session: AuthSession = {
      user: {
        id: authResponse.user.id,
        email: authResponse.user.email,
        name: userProfile?.name || authResponse.user.email,
        role: userProfile?.role || "user",
      },
      token: authResponse.token,
    };

    return { success: true, session };
  } catch (error: any) {
    console.error("[v0] Login error:", error);
    return {
      success: false,
      error:
        error?.message ||
        "Login failed. Please check your credentials.",
    };
  }
}

export async function logout(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const manta = getMantaClient();
    await manta.auth.signOut();
    return { success: true };
  } catch (error: any) {
    console.error("[v0] Logout error:", error);
    return { success: true };
  }
}

export async function getAllUsers(): Promise<
  Array<{
    email: string;
    name: string;
    role: "user" | "admin";
  }>
> {
  try {
    const manta = getMantaClient();
    const usersTable = manta.db.collection("users");
    const users = await usersTable.find({});
    return users.map(({ email, name, role }) => ({
      email,
      name,
      role,
    }));
  } catch (error) {
    console.error("[v0] Failed to fetch users:", error);
    return [];
  }
}
