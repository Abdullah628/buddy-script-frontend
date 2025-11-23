import { api } from "@/lib/api";
export async function logout() {
  return api("/auth/logout", {
    method: "POST",
  });
}