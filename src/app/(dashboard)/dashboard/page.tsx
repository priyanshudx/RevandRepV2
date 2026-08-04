import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  User,
  ChevronRight,
  Package,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { formatPhone } from "@/lib/utils";
import { getCurrentUser } from "@/lib/dal";
import { getUserOrdersAction } from "@/actions/orders";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Logo } from "@/components/shared/Logo";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { StatusTimeline } from "@/components/dashboard/StatusTimeline";
import type { OrderWithDetails } from "@/types";

export const metadata: Metadata = {
  title: "My Dashboard — Rev & Rep",
  description: "View your personalized diet plan and order status.",
};

export default async function DashboardPage() {
  const [user, orders] = await Promise.all([
    getCurrentUser(),
    getUserOrdersAction(),
  ]);

  const publishedOrders = orders.filter((o) => o.status === "DIET_PUBLISHED");
  const latestPublished = publishedOrders[0] ?? null;

  return (
    <div className="min-h-screen bg-[#080808] relative overflow-hidden">
      {/* Minimalistic Car & Gym Theme Background Image */}
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center opacity-65 filter contrast-[1.1] brightness-90"
        style={{ backgroundImage: `url('/dashboard-bg.png')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/60 via-[#080808]/30 to-[#080808]/85" />
      </div>

      <div className="relative z-10">
        {/* Top bar */}
        <header className="border-b border-[#1e1e1e] bg-[#080808]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="container h-14 flex items-center justify-between">
            <Logo size={34} />
            <div className="flex items-center gap-4">
              <span className="text-[#5a5a5a] text-sm hidden sm:block">
                {user.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </header>

        <div className="container py-10">
        {/* Welcome */}
        <div className="mb-10">
          <p className="text-[#5a5a5a] text-sm mb-1">Welcome back,</p>
          <h1 className="text-white font-bold text-2xl md:text-3xl">
            {user.name ?? user.email}
          </h1>
        </div>

        {/* Latest published plan highlight */}
        {latestPublished?.dietFile && (
          <div
            className="rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden"
            style={{
              background: "#141414",
              border: "1px solid rgba(196,30,58,0.25)",
              boxShadow: "0 0 40px rgba(196,30,58,0.06)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "#c41e3a" }}
            />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1a0509] border border-[#3a0a14] flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-[#c41e3a]" />
                </div>
                <div>
                  <p className="text-[#c41e3a] text-xs font-bold uppercase tracking-widest mb-1">
                    Your Diet Plan is Ready
                  </p>
                  <h2 className="text-white font-bold text-lg mb-1">
                    {latestPublished.dietFile.originalFileName}
                  </h2>
                  {latestPublished.questionnaire && (
                    <p className="text-[#5a5a5a] text-sm">
                      Goal:{" "}
                      {latestPublished.questionnaire.fitnessGoal
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </p>
                  )}
                </div>
              </div>
              <DownloadButton
                orderId={latestPublished.id}
                className="btn-primary flex-shrink-0"
                id="dashboard-download"
              />
            </div>
          </div>
        )}

        {/* Empty state */}
        {orders.length === 0 && (
          <div className="card p-10 text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#1a0509] border border-[#3a0a14] flex items-center justify-center mx-auto mb-4">
              <Package size={24} className="text-[#c41e3a]" />
            </div>
            <h2 className="text-white font-bold text-lg mb-2">No orders yet</h2>
            <p className="text-[#5a5a5a] text-sm mb-6 max-w-xs mx-auto">
              Get your personalized Indian diet plan for just ₹19. Delivered within 24 hours.
            </p>
            <Link
              href={ROUTES.questionnaire}
              className="btn-primary inline-flex"
              id="dashboard-get-plan"
            >
              Get Your Diet Plan
              <ChevronRight size={16} />
            </Link>
          </div>
        )}

        {/* Order timeline cards */}
        {orders.length > 0 && (
          <div>
            <h2 className="text-white font-bold text-lg mb-5">My Diet Requests</h2>
            <div className="space-y-4">
              {orders.map((order: OrderWithDetails) => {
                const goalLabel = order.questionnaire
                  ? order.questionnaire.fitnessGoal
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (c: string) => c.toUpperCase()) + " Plan"
                  : "Diet Plan";

                return (
                  <div key={order.id}>
                    <StatusTimeline
                      orderId={order.id}
                      status={order.status}
                      rejectionReason={order.payment?.rejectionReason}
                      goalLabel={goalLabel}
                    />
                    {/* Download button if published */}
                    {order.status === "DIET_PUBLISHED" && order.dietFile && (
                      <div className="mt-3 flex justify-end">
                        <DownloadButton
                          orderId={order.id}
                          id={`download-${order.id}`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Profile section */}
        <div className="mt-10 card p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 rounded-full bg-[#1a0509] border border-[#3a0a14] flex items-center justify-center">
              <User size={18} className="text-[#c41e3a]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">My Profile</p>
              <p className="text-[#5a5a5a] text-xs">{user.email}</p>
            </div>
          </div>
          <Link
            href={ROUTES.questionnaire}
            className="flex items-center justify-between text-sm font-semibold text-[#c41e3a] hover:text-white py-3 px-3 rounded-xl border border-[rgba(196,30,58,0.3)] bg-[rgba(196,30,58,0.08)] hover:bg-[#c41e3a] mt-1 transition-all duration-200"
            id="dashboard-get-new-plan"
          >
            <span>Get Another Diet Plan</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
