import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Dashboard } from "./Dashboard";
import { NotAdmin } from "./NotAdmin";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") return <NotAdmin email={user.email} />;
  return <Dashboard user={user} />;
}

