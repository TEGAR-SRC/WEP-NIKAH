import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "jsonwebtoken";
import DashboardClient from "./DashboardClient";

export const metadata = { title: "Dashboard - Nikah" };

const JWT_SECRET = process.env.JWT_SECRET || "nikah-jwt-secret-change-in-production";

export default async function DashboardPage() {
  const c = await cookies();
  const token = c.get("dash-auth")?.value;
  if (!token) redirect("/dashboard/login");

  try {
    verify(token, JWT_SECRET);
  } catch {
    redirect("/dashboard/login");
  }

  return <DashboardClient />;
}
