import { redirect } from "next/navigation";
import { cookies } from "next/headers";
// import Navbar from "@/components/shared/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("accessToken"); // backend should set httpOnly cookie

  if (!token) redirect("/login");

  return (
    <div>
      {/* <Navbar /> */}
      <main className="p-5">{children}</main>
    </div>
  );
}
