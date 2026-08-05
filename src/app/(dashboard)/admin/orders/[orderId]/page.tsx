import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  User,
  Target,
  Utensils,
  Clock,
  Heart,
  FileText,
  CheckCircle,
} from "lucide-react";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/services/prisma";
import { formatDate, formatPhone, formatCurrency, enumToLabel } from "@/lib/utils";
import { ORDER_STATUS_LABELS, ROUTES } from "@/lib/constants";
import { AdminViewDietButton } from "@/components/admin/AdminViewDietButton";

export const metadata: Metadata = {
  title: "Order Detail — Admin — Rev & Rep",
};

interface PageProps {
  params: Promise<{ orderId: string }>;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  QUESTIONNAIRE_SUBMITTED: {
    label: "Questionnaire Done",
    color: "text-[#a0a0a0]",
    bg: "bg-[rgba(160,160,160,0.1)]",
    border: "border-[rgba(160,160,160,0.2)]",
  },
  PAYMENT_PENDING: {
    label: "Pending Verification",
    color: "text-[#f59e0b]",
    bg: "bg-[rgba(245,158,11,0.1)]",
    border: "border-[rgba(245,158,11,0.2)]",
  },
  PAYMENT_VERIFIED: {
    label: "Payment Verified",
    color: "text-[#22c55e]",
    bg: "bg-[rgba(34,197,94,0.1)]",
    border: "border-[rgba(34,197,94,0.2)]",
  },
  PAYMENT_REJECTED: {
    label: "Payment Rejected",
    color: "text-[#c41e3a]",
    bg: "bg-[rgba(196,30,58,0.1)]",
    border: "border-[rgba(196,30,58,0.2)]",
  },
  DIET_IN_PROGRESS: {
    label: "Diet In Progress",
    color: "text-[#3b82f6]",
    bg: "bg-[rgba(59,130,246,0.1)]",
    border: "border-[rgba(59,130,246,0.2)]",
  },
  DIET_PUBLISHED: {
    label: "Published",
    color: "text-[#22c55e]",
    bg: "bg-[rgba(34,197,94,0.1)]",
    border: "border-[rgba(34,197,94,0.2)]",
  },
};

function TagList({ items }: { items: string[] }) {
  if (!items.length) return <span className="text-[#5a5a5a] text-sm">—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="text-xs px-2.5 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2a2a2a", color: "#a0a0a0" }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-[#1e1e1e] last:border-0">
      <span className="text-[#5a5a5a] text-xs uppercase tracking-wide font-medium min-w-[140px]">
        {label}
      </span>
      <span className="text-[#e0e0e0] text-sm">{value}</span>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6 mb-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1e1e1e]">
        <div className="w-7 h-7 rounded-lg bg-[rgba(196,30,58,0.08)] border border-[rgba(196,30,58,0.12)] flex items-center justify-center">
          <Icon size={13} className="text-[#c41e3a]" />
        </div>
        <h2 className="text-white font-semibold text-sm">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default async function OrderDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      payment: true,
      questionnaire: true,
      dietFile: true,
    },
  });

  if (!order) redirect(ROUTES.admin);

  const sc =
    statusConfig[order.status as keyof typeof statusConfig] ??
    statusConfig["QUESTIONNAIRE_SUBMITTED"];
  const q = order.questionnaire;

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header */}
      <header className="border-b border-[#1e1e1e] bg-[#080808]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container h-14 flex items-center gap-3">
          <Link
            href="/admin"
            className="btn-ghost py-1.5 px-2 text-sm"
            id="order-detail-back"
          >
            <ArrowLeft size={15} />
            Admin
          </Link>
          <span className="text-[#3a3a3a]">/</span>
          <span className="text-[#5a5a5a] text-sm font-mono truncate max-w-[200px]">
            {orderId}
          </span>
        </div>
      </header>

      <div className="container py-10 max-w-3xl">
        {/* Page title + status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-white font-bold text-2xl mb-1">Order Detail</h1>
            <p className="text-[#5a5a5a] text-sm font-mono">{orderId}</p>
          </div>
          <span
            className={`badge text-sm px-3 py-1.5 ${sc.bg} ${sc.color} border ${sc.border}`}
          >
            {ORDER_STATUS_LABELS[String(order.status)] ?? String(order.status)}
          </span>
        </div>

        {/* Order summary */}
        <Section icon={FileText} title="Order Summary">
          <InfoRow label="Order ID" value={<span className="font-mono text-xs">{order.id}</span>} />
          <InfoRow label="Amount" value={formatCurrency(order.amountInPaise)} />
          <InfoRow label="Ordered At" value={formatDate(order.createdAt)} />
          {order.payment && (
            <>
              <InfoRow label="UTR Number" value={<span className="font-mono text-xs">{order.payment.utrNumber}</span>} />
              <InfoRow label="Payment Status" value={order.payment.status} />
              {order.payment.rejectionReason && (
                <InfoRow label="Rejection Reason" value={<span className="text-[#c41e3a]">{order.payment.rejectionReason}</span>} />
              )}
            </>
          )}
          {order.dietFile && (
            <InfoRow label="Diet File" value={
              <span className="text-[#22c55e] flex items-center gap-1 font-mono text-xs">
                <CheckCircle size={13} />
                {order.dietFile.originalFileName}
              </span>
            } />
          )}
        </Section>

        {/* Given Diet Plan section */}
        {(order.dietFile || order.dietContent || order.status === "DIET_PUBLISHED") && (
          <Section icon={FileText} title="Given Diet Plan">
            {order.dietFile && (
              <InfoRow
                label="Published PDF"
                value={
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-1">
                    <span className="font-mono text-xs text-[#22c55e]">
                      {order.dietFile.originalFileName} ({(order.dietFile.sizeBytes / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                    <AdminViewDietButton orderId={order.id} />
                  </div>
                }
              />
            )}
            {order.dietPublishedAt && (
              <InfoRow label="Published Date" value={formatDate(order.dietPublishedAt)} />
            )}
            {order.dietContent && (
              <InfoRow
                label="Draft Notes"
                value={
                  <div className="bg-[#0e0e0e] p-3 rounded-xl border border-[#1e1e1e] text-xs text-[#a0a0a0] whitespace-pre-wrap w-full">
                    {order.dietContent}
                  </div>
                }
              />
            )}
          </Section>
        )}

        {/* User info */}
        <Section icon={User} title="Customer">
          <InfoRow label="Name" value={order.user.name ?? "—"} />
          <InfoRow label="Email" value={order.user.email} />
          <InfoRow label="User ID" value={<span className="font-mono text-xs">{order.user.id}</span>} />
          <InfoRow label="Joined" value={formatDate(order.user.createdAt)} />
        </Section>

        {/* Questionnaire */}
        {q ? (
          <>
            {/* Personal */}
            <Section icon={User} title="Personal Details">
              <InfoRow label="Name" value={q.name} />
              <InfoRow label="Age" value={`${q.age} years`} />
              <InfoRow label="Gender" value={enumToLabel(q.gender)} />
              <InfoRow label="Height" value={`${q.heightCm} cm`} />
              <InfoRow label="Weight" value={`${q.weightKg} kg`} />
              <InfoRow label="City" value={q.city} />
              <InfoRow label="State" value={q.state} />
            </Section>

            {/* Goals */}
            <Section icon={Target} title="Goals & Preferences">
              <InfoRow label="Fitness Goal" value={enumToLabel(q.fitnessGoal)} />
              <InfoRow label="Food Preference" value={enumToLabel(q.foodPreference)} />
              {q.medicalConditions.length > 0 && (
                <InfoRow label="Medical Conditions" value={<TagList items={q.medicalConditions} />} />
              )}
              {q.allergies && <InfoRow label="Allergies" value={q.allergies} />}
            </Section>

            {/* Food choices */}
            <Section icon={Utensils} title="Food Choices">
              <InfoRow label="Staple Foods" value={<TagList items={q.stapleFoods} />} />
              <InfoRow label="Protein Sources" value={<TagList items={q.proteinSources} />} />
              <InfoRow label="Vegetables" value={<TagList items={q.vegetables} />} />
              <InfoRow label="Fruits" value={<TagList items={q.fruits} />} />
              <InfoRow label="Snacks" value={<TagList items={q.snacks} />} />
              <InfoRow label="Drinks" value={<TagList items={q.drinks} />} />
              {q.favouriteFoods && <InfoRow label="Favourite Foods" value={q.favouriteFoods} />}
              {q.hatedFoods && <InfoRow label="Foods to Avoid" value={q.hatedFoods} />}
            </Section>

            {/* Routine */}
            <Section icon={Clock} title="Daily Routine">
              <InfoRow label="Wake Up" value={q.wakeUpTime} />
              <InfoRow label="Sleep" value={q.sleepTime} />
              <InfoRow label="Work Timings" value={q.workTimings} />
              <InfoRow label="Work Type" value={enumToLabel(q.workType)} />
              <InfoRow label="Exercise" value={enumToLabel(q.exercise)} />
            </Section>

            {/* Additional notes */}
            {q.additionalNotes && (
              <Section icon={Heart} title="Additional Notes">
                <p className="text-[#a0a0a0] text-sm leading-relaxed">
                  {q.additionalNotes}
                </p>
              </Section>
            )}
          </>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-[#5a5a5a] text-sm">
              No questionnaire submitted for this order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
