export interface AuthSession {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "admin" | "user";
  };
  expires: string;
}

export async function signup(
  fullName: string,
  email: string,
  password: string,
  confirm_password: string,
) {
  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password, confirm_password }),
  });

  return res.json();
}

export async function login(
  email: string,
  password: string,
  fullname?: string,
) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, fullname }),
  });

  return res.json();
}

export async function logout() {
  const res = await fetch("/api/logout", {
    method: "POST",
  });

  return res.json();
}
