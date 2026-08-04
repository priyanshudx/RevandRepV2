import type { Metadata } from "next";
import { getAdminStatsAction, getAllOrdersAction, getAllUsersAction } from "@/actions/admin";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = {
  title: "Admin Control Center — Rev & Rep",
  description: "Manage diet plan requests, verify payments, edit users, and publish diet plans.",
};

export default async function AdminPage() {
  const [stats, orders, users] = await Promise.all([
    getAdminStatsAction(),
    getAllOrdersAction(),
    getAllUsersAction(),
  ]);

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <header className="border-b border-[#1e1e1e] bg-[#080808]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={34} />
            <span className="text-[#3a3a3a]">/</span>
            <span className="text-[#5a5a5a] text-sm">Admin Control Center</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-white font-black text-2xl md:text-3xl mb-1">
            Admin Dashboard
          </h1>
          <p className="text-[#5a5a5a] text-sm">
            Manage user accounts, verify payment receipts, create and publish diet plans.
          </p>
        </div>

        {/* Dashboard Client Component */}
        <AdminDashboardClient stats={stats} orders={orders} users={users} />
      </div>
    </div>
  );
}
