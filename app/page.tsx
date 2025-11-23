import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const token = (await cookies()).get("accessToken");

  if (token) {
    // user is logged in → go to feed
    redirect("/feed");
  } else {
    // user is not logged in → go to login
    redirect("/login");
  }

  return null;
}
