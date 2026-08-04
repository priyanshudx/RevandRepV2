"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Upload, Filter, Search } from "lucide-react";
import { UploadDietFileModal } from "@/components/admin/UploadDietFileModal";
import { formatDate, formatCurrency, formatPhone, enumToLabel } from "@/lib/utils";
import type { OrderWithDetails } from "@/types";

const statusConfig: Record<string, { label: string; color: string }> = {
  QUESTIONNAIRE_SUBMITTED: { label: "Awaiting Payment", color: "badge-info" },
  PAYMENT_PENDING: { label: "Pending Verification", color: "badge-warning" },
  PAYMENT_VERIFIED: { label: "Verified", color: "badge-success" },
  PAYMENT_REJECTED: { label: "Rejected", color: "badge-error" },
  DIET_IN_PROGRESS: { label: "Diet In Progress", color: "badge-info" },
  DIET_PUBLISHED: { label: "Published", color: "badge-success" },
};

interface AdminOrdersTableProps {
  orders: OrderWithDetails[];
}

export function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [uploadTarget, setUploadTarget] = useState<{
    orderId: string;
    userName: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredOrders = orders.filter((order) => {
    const name = order.user.name ?? "";
    const email = order.user.email;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      name.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleUploadSuccess() {
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      {/* Modal */}
      {uploadTarget && (
        <UploadDietFileModal
          orderId={uploadTarget.orderId}
          userName={uploadTarget.userName}
          onClose={() => setUploadTarget(null)}
          onSuccess={handleUploadSuccess}
        />
      )}

      {/* Table card */}
      <div className="card overflow-hidden">
        {/* Table header controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-[#1e1e1e]">
          <h2 className="text-white font-bold text-base">
            All Orders{" "}
            <span className="text-[#5a5a5a] font-normal text-sm">
              ({filteredOrders.length})
            </span>
          </h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a5a]"
              />
              <input
                type="search"
                className="input-base pl-8 py-2 text-sm w-48 md:w-64"
                id="admin-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <Filter
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a5a5a] pointer-events-none"
              />
              <select
                className="input-base pl-8 py-2 text-sm appearance-none pr-3"
                id="admin-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="PAYMENT_RECEIVED">Payment Received</option>
                <option value="PREPARING">Preparing</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e1e]">
                {[
                  "Order ID",
                  "User",
                  "Goal",
                  "Status",
                  "Amount",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-[#5a5a5a] text-xs font-medium uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-[#5a5a5a] text-sm"
                  >
                    No orders match your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, i) => {
                  const sc = statusConfig[order.status];
                  const goalLabel = order.questionnaire
                    ? enumToLabel(order.questionnaire.fitnessGoal)
                    : "—";
                  const userName =
                    order.user.name ||
                    order.user.email;

                  return (
                    <tr
                      key={order.id}
                      className={`border-b border-[#1e1e1e] hover:bg-[#111111] transition-colors ${
                        i === filteredOrders.length - 1 ? "border-0" : ""
                      }`}
                    >
                      <td className="px-5 py-4 text-[#5a5a5a] font-mono text-xs">
                        {order.id.slice(0, 12)}…
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{userName}</p>
                        <p className="text-[#5a5a5a] text-xs">
                          {order.user.email}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-[#a0a0a0]">
                        {goalLabel}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${sc.color}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white font-medium">
                        {formatCurrency(order.amountInPaise)}
                      </td>
                      <td className="px-5 py-4 text-[#5a5a5a] text-xs">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {/* View questionnaire */}
                          <a
                            href={`/admin/orders/${order.id}`}
                            className="btn-ghost py-1 px-2 text-xs"
                            id={`view-${order.id}`}
                            title="View questionnaire"
                          >
                            <Eye size={13} />
                          </a>

                          {/* Upload diet plan */}
                          {order.status !== "DIET_PUBLISHED" && (
                            <button
                              className="btn-primary py-1 px-2.5 text-xs"
                              id={`upload-${order.id}`}
                              title="Upload diet plan PDF"
                              onClick={() =>
                                setUploadTarget({
                                  orderId: order.id,
                                  userName,
                                })
                              }
                            >
                              <Upload size={13} />
                              Upload
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
