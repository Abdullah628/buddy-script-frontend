import { api } from "@/lib/api";

export async function register(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  return api("/user/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string }) {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return api("/auth/logout", {
    method: "POST",
  });
}


export async function me() {
  return api("/user/me", {
    method: "GET",
  });
}

