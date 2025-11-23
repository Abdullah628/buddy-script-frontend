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
