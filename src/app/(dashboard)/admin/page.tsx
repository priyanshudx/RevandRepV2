import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  Users,
  ShoppingBag,
  IndianRupee,
  Clock,
  CheckCircle,
  Shield,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getAdminStatsAction, getAllOrdersAction } from "@/actions/admin";
import { DietRequestsTable } from "@/components/admin/DietRequestsTable";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = {
  title: "Admin — Rev & Rep",
  description: "Manage diet plan requests, verify payments, and publish diet plans.",
};

export default async function AdminPage() {
  const [stats, orders] = await Promise.all([
    getAdminStatsAction(),
    getAllOrdersAction(),
  ]);

  const statCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: IndianRupee,
      color: "text-[#22c55e]",
      bg: "bg-[rgba(34,197,94,0.08)]",
      border: "border-[rgba(34,197,94,0.15)]",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-[#3b82f6]",
      bg: "bg-[rgba(59,130,246,0.08)]",
      border: "border-[rgba(59,130,246,0.15)]",
    },
    {
      label: "Today",
      value: stats.ordersToday,
      icon: BarChart3,
      color: "text-[#c41e3a]",
      bg: "bg-[rgba(196,30,58,0.08)]",
      border: "border-[rgba(196,30,58,0.15)]",
    },
    {
      label: "Needs Verification",
      value: stats.pendingVerification,
      icon: Clock,
      color: "text-[#f59e0b]",
      bg: "bg-[rgba(245,158,11,0.08)]",
      border: "border-[rgba(245,158,11,0.15)]",
    },
    {
      label: "Diet In Progress",
      value: stats.dietInProgress,
      icon: Shield,
      color: "text-[#3b82f6]",
      bg: "bg-[rgba(59,130,246,0.08)]",
      border: "border-[rgba(59,130,246,0.15)]",
    },
    {
      label: "Published",
      value: stats.published,
      icon: CheckCircle,
      color: "text-[#22c55e]",
      bg: "bg-[rgba(34,197,94,0.08)]",
      border: "border-[rgba(34,197,94,0.15)]",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-[#a0a0a0]",
      bg: "bg-[rgba(160,160,160,0.08)]",
      border: "border-[rgba(160,160,160,0.1)]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <header className="border-b border-[#1e1e1e] bg-[#080808]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={34} />
            <span className="text-[#3a3a3a]">/</span>
            <span className="text-[#5a5a5a] text-sm">Admin</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="container py-10">
        <div className="mb-8">
          <h1 className="text-white font-black text-2xl md:text-3xl mb-1">
            Diet Requests
          </h1>
          <p className="text-[#5a5a5a] text-sm">
            Verify payments, create diet plans, and publish to users.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`rounded-xl p-4 border ${stat.border}`}
                style={{ background: "#141414" }}
              >
                <div
                  className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}
                >
                  <Icon size={15} className={stat.color} />
                </div>
                <p className="text-white font-bold text-xl mb-0.5">{stat.value}</p>
                <p className="text-[#5a5a5a] text-xs leading-tight">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Diet Requests */}
        <DietRequestsTable orders={orders} />
      </div>
    </div>
  );
}
