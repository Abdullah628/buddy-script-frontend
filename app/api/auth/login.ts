import { api } from "@/lib/api";

export async function login(payload: { email: string; password: string }) {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

