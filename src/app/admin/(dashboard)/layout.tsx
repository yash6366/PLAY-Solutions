import { redirect } from "next/navigation";
import { getAdminSession } from "@/server/auth/session";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminDashboardShell user={session}>{children}</AdminDashboardShell>;
}
