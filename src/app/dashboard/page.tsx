import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const metadata = { title: "Dashboard - Nikah" };

export default async function DashboardPage() {
  const c = await cookies();
  if (!c.has("dash-auth")) redirect("/dashboard/login");
  return <DashboardClient />;
}
