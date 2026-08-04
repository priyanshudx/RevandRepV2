"use server";

import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/services/prisma";
import { getSupabaseAdmin, DIET_BUCKET } from "@/services/supabase";
import type { AdminStats, OrderWithDetails } from "@/types";

// ── getAdminStatsAction ───────────────────────────────────────────────────

export async function getAdminStatsAction(): Promise<AdminStats> {
  await requireAdmin();

  const now = new Date();
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const [
    totalOrders,
    totalRevenueResult,
    ordersToday,
    pendingVerification,
    dietInProgress,
    published,
    totalUsers,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { amountInPaise: true } }),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.count({ where: { status: "PAYMENT_PENDING" } }),
    prisma.order.count({ where: { status: { in: ["PAYMENT_VERIFIED", "DIET_IN_PROGRESS"] } } }),
    prisma.order.count({ where: { status: "DIET_PUBLISHED" } }),
    prisma.user.count(),
  ]);

  return {
    totalOrders,
    totalRevenue: totalRevenueResult._sum.amountInPaise ?? 0,
    ordersToday,
    pendingVerification,
    dietInProgress,
    published,
    totalUsers,
  };
}

// ── getAllOrdersAction ─────────────────────────────────────────────────────

export async function getAllOrdersAction(): Promise<OrderWithDetails[]> {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      amountInPaise: true,
      dietContent: true,
      dietPublishedAt: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: { id: true, email: true, name: true },
      },
      payment: {
        select: {
          id: true,
          utrNumber: true,
          screenshotPath: true,
          amountInPaise: true,
          status: true,
          rejectionReason: true,
          createdAt: true,
        },
      },
      questionnaire: {
        select: {
          id: true,
          name: true,
          age: true,
          gender: true,
          heightCm: true,
          weightKg: true,
          city: true,
          state: true,
          fitnessGoal: true,
          foodPreference: true,
          stapleFoods: true,
          proteinSources: true,
          vegetables: true,
          fruits: true,
          snacks: true,
          drinks: true,
          medicalConditions: true,
          wakeUpTime: true,
          sleepTime: true,
          workTimings: true,
          workType: true,
          exercise: true,
          allergies: true,
          favouriteFoods: true,
          hatedFoods: true,
          additionalNotes: true,
        },
      },
      dietFile: {
        select: { id: true, originalFileName: true, uploadedAt: true },
      },
    },
  });

  return orders as OrderWithDetails[];
}

// ── verifyPaymentAction ───────────────────────────────────────────────────

export async function verifyPaymentAction(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    await prisma.$transaction([
      prisma.payment.update({
        where: { orderId },
        data: { status: "VERIFIED", rejectionReason: null },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: "DIET_IN_PROGRESS" },
      }),
    ]);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ── rejectPaymentAction ───────────────────────────────────────────────────

export async function rejectPaymentAction(
  orderId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  if (!reason.trim()) {
    return { success: false, error: "Please provide a rejection reason." };
  }

  try {
    await prisma.$transaction([
      prisma.payment.update({
        where: { orderId },
        data: { status: "REJECTED", rejectionReason: reason.trim() },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: "PAYMENT_REJECTED" },
      }),
    ]);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ── saveDietDraftAction ───────────────────────────────────────────────────

export async function saveDietDraftAction(
  orderId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { dietContent: content, status: "DIET_IN_PROGRESS" },
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// ── uploadDietFileAction ──────────────────────────────────────────────────

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function uploadDietFileAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  const orderId = formData.get("orderId");
  const file = formData.get("file");

  if (typeof orderId !== "string" || !orderId) {
    return { success: false, error: "Missing orderId." };
  }
  if (!(file instanceof File)) {
    return { success: false, error: "No file provided." };
  }
  const isPdfMime = file.type === "application/pdf" || file.type === "application/x-pdf";
  const isPdfExt = file.name.toLowerCase().endsWith(".pdf");
  if (!isPdfMime && !isPdfExt) {
    return { success: false, error: "Only PDF files are allowed." };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: "File must be under 10 MB." };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, dietFile: { select: { supabasePath: true } } },
  });

  if (!order) return { success: false, error: "Order not found." };

  const storagePath = `${orderId}.pdf`;

  if (order.dietFile?.supabasePath) {
    try {
      await getSupabaseAdmin().storage.from(DIET_BUCKET).remove([order.dietFile.supabasePath]);
    } catch {
      // Ignore remove errors
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await getSupabaseAdmin()
    .storage.from(DIET_BUCKET)
    .upload(storagePath, buffer, { contentType: "application/pdf", upsert: true });

  if (uploadError) {
    console.error("[uploadDietFileAction Storage Error]:", uploadError);
    return { success: false, error: `Upload failed: ${uploadError.message}` };
  }

  const mimeType = file.type || "application/pdf";

  try {
    await prisma.$transaction([
      prisma.dietFile.upsert({
        where: { orderId },
        create: {
          orderId,
          supabasePath: storagePath,
          originalFileName: file.name,
          mimeType,
          sizeBytes: file.size,
        },
        update: {
          supabasePath: storagePath,
          originalFileName: file.name,
          mimeType,
          sizeBytes: file.size,
          uploadedAt: new Date(),
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: "DIET_PUBLISHED", dietPublishedAt: new Date() },
      }),
    ]);
  } catch (err) {
    await getSupabaseAdmin().storage.from(DIET_BUCKET).remove([storagePath]);
    const message = err instanceof Error ? err.message : "Database error";
    return { success: false, error: message };
  }

  return { success: true };
}

// ── updateOrderStatusAction ───────────────────────────────────────────────

export async function updateOrderStatusAction(
  orderId: string,
  status: "QUESTIONNAIRE_SUBMITTED" | "PAYMENT_PENDING" | "PAYMENT_VERIFIED" | "PAYMENT_REJECTED" | "DIET_IN_PROGRESS" | "DIET_PUBLISHED"
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();

  try {
    await prisma.order.update({ where: { id: orderId }, data: { status } });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
