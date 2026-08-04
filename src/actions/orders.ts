"use server";

import { verifySession } from "@/lib/dal";
import { prisma } from "@/services/prisma";
import { getSignedUrl } from "@/services/supabase";
import type { OrderWithDetails } from "@/types";

const ORDER_SELECT = {
  id: true,
  status: true,
  amountInPaise: true,
  dietContent: true,
  dietPublishedAt: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, email: true, name: true } },
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
  dietFile: { select: { id: true, originalFileName: true, uploadedAt: true } },
} as const;

// ── getUserOrdersAction ───────────────────────────────────────────────────

export async function getUserOrdersAction(): Promise<OrderWithDetails[]> {
  const session = await verifySession();

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    select: ORDER_SELECT,
  });

  return orders as OrderWithDetails[];
}

// ── getOrderByIdAction ────────────────────────────────────────────────────

export async function getOrderByIdAction(
  orderId: string
): Promise<OrderWithDetails | null> {
  const session = await verifySession();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.userId },
    select: ORDER_SELECT,
  });

  return order as OrderWithDetails | null;
}

// ── getDietFileDownloadUrlAction ──────────────────────────────────────────

export async function getDietFileDownloadUrlAction(
  orderId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const session = await verifySession();

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.userId,
      status: "DIET_PUBLISHED",
    },
    select: { dietFile: { select: { supabasePath: true } } },
  });

  if (!order?.dietFile?.supabasePath) {
    return { success: false, error: "Diet file not found." };
  }

  try {
    const url = await getSignedUrl(order.dietFile.supabasePath, 3600);
    return { success: true, url };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate download link";
    return { success: false, error: message };
  }
}
