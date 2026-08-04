"use client";

import { useState } from "react";
import {
  BarChart3,
  Users as UsersIcon,
  ShoppingBag,
  IndianRupee,
  Clock,
  CheckCircle,
  Shield,
  FileText,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DietRequestsTable } from "@/components/admin/DietRequestsTable";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import type { AdminStats, OrderWithDetails, AdminUserItem } from "@/types";

interface Props {
  stats: AdminStats;
  orders: OrderWithDetails[];
  users: AdminUserItem[];
}

export function AdminDashboardClient({ stats, orders, users }: Props) {
  const [activeTab, setActiveTab] = useState<"orders" | "users">("orders");

  const statCards = [
    {
      label: "Verified Revenue",
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
      label: "Orders Today",
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
      icon: UsersIcon,
      color: "text-[#a0a0a0]",
      bg: "bg-[rgba(160,160,160,0.08)]",
      border: "border-[rgba(160,160,160,0.1)]",
    },
  ];

  return (
    <div>
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
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

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 mb-8 border-b border-[#1e1e1e] pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "orders"
              ? "bg-[#c41e3a] text-white shadow-lg shadow-[#c41e3a]/20"
              : "bg-[#141414] text-[#5a5a5a] border border-[#2a2a2a] hover:text-[#a0a0a0] hover:border-[#3a3a3a]"
          }`}
        >
          <FileText size={16} />
          Orders &amp; Diet Plans ({orders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "users"
              ? "bg-[#c41e3a] text-white shadow-lg shadow-[#c41e3a]/20"
              : "bg-[#141414] text-[#5a5a5a] border border-[#2a2a2a] hover:text-[#a0a0a0] hover:border-[#3a3a3a]"
          }`}
        >
          <UsersIcon size={16} />
          User Management ({users.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "orders" ? (
        <DietRequestsTable orders={orders} />
      ) : (
        <AdminUsersTable users={users} />
      )}
    </div>
  );
}
