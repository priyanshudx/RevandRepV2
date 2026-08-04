"use server";

import { verifySession } from "@/lib/dal";
import { prisma } from "@/services/prisma";
import { getSupabaseAdmin } from "@/services/supabase";
import { PRODUCT } from "@/lib/constants";

const SCREENSHOT_BUCKET = "payment-screenshots";
const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024; // 5 MB

// ── submitUpiPaymentAction ────────────────────────────────────────────────

/**
 * Called when the user submits UTR number + optional screenshot.
 * Creates a Payment row and sets Order status to PAYMENT_PENDING.
 *
 * Migration path: When adding Razorpay later, this action is bypassed entirely
 * — the Razorpay webhook will directly set PAYMENT_VERIFIED.
 */
export async function submitUpiPaymentAction(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await verifySession();

  const orderId = formData.get("orderId");
  const utrNumber = formData.get("utrNumber");
  const screenshotFile = formData.get("screenshot");

  if (typeof orderId !== "string" || !orderId.trim()) {
    return { success: false, error: "Missing order ID." };
  }

  if (typeof utrNumber !== "string" || !utrNumber.trim()) {
    return { success: false, error: "Please enter your 12-digit UTR / Transaction ID." };
  }

  const cleanUtr = utrNumber.replace(/\s+/g, "").trim();

  // Validate UTR format: standard UPI UTR is 12 digits
  if (!/^\d+$/.test(cleanUtr)) {
    return { success: false, error: "UTR / Transaction ID must contain numbers only." };
  }

  if (cleanUtr.length !== 12) {
    return {
      success: false,
      error: `Standard UPI UTR number must be exactly 12 digits (you entered ${cleanUtr.length} digits). Please check your UPI app receipt.`,
    };
  }

  // Check if this UTR was already used for another order
  const duplicatePayment = await prisma.payment.findFirst({
    where: {
      utrNumber: cleanUtr,
      orderId: { not: orderId.trim() },
    },
    select: { id: true },
  });

  if (duplicatePayment) {
    return {
      success: false,
      error: "This UTR / Transaction ID has already been submitted for another order. Please check your transaction details.",
    };
  }

  // Verify the order belongs to this user and is in the right state
  const order = await prisma.order.findFirst({
    where: {
      id: orderId.trim(),
      userId: session.userId,
    },
    select: { id: true, status: true, amountInPaise: true, payment: { select: { id: true } } },
  });

  if (!order) {
    return { success: false, error: "Order not found." };
  }

  if (
    order.status === "PAYMENT_PENDING" ||
    order.status === "PAYMENT_VERIFIED" ||
    order.status === "DIET_IN_PROGRESS" ||
    order.status === "DIET_PUBLISHED"
  ) {
    return { success: false, error: "Payment for this order has already been submitted." };
  }

  // Upload screenshot if provided
  let screenshotPath: string | null = null;
  if (screenshotFile instanceof File && screenshotFile.size > 0) {
    if (screenshotFile.size > MAX_SCREENSHOT_SIZE) {
      return { success: false, error: "Screenshot must be under 5 MB." };
    }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(screenshotFile.type)) {
      return { success: false, error: "Screenshot must be JPG, PNG, or WebP." };
    }

    const ext = screenshotFile.name.split(".").pop() ?? "jpg";
    screenshotPath = `${orderId}.${ext}`;

    const arrayBuffer = await screenshotFile.arrayBuffer();
    const { error: uploadError } = await getSupabaseAdmin()
      .storage.from(SCREENSHOT_BUCKET)
      .upload(screenshotPath, arrayBuffer, {
        contentType: screenshotFile.type,
        upsert: true,
      });

    if (uploadError) {
      // Non-fatal: proceed without screenshot
      console.warn("[submitUpiPaymentAction] Screenshot upload failed:", uploadError.message);
      screenshotPath = null;
    }
  }

  try {
    // Upsert Payment + update Order status in a transaction
    await prisma.$transaction([
      // Upsert payment (handles resubmission case)
      order.payment
        ? prisma.payment.update({
            where: { orderId: orderId.trim() },
            data: {
              utrNumber: utrNumber.trim(),
              screenshotPath,
              status: "PENDING_VERIFICATION",
              rejectionReason: null,
            },
          })
        : prisma.payment.create({
            data: {
              orderId: orderId.trim(),
              utrNumber: utrNumber.trim(),
              screenshotPath,
              amountInPaise: order.amountInPaise,
              status: "PENDING_VERIFICATION",
            },
          }),
      prisma.order.update({
        where: { id: orderId.trim() },
        data: { status: "PAYMENT_PENDING" },
      }),
    ]);

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    console.error("[submitUpiPaymentAction]", message);
    return { success: false, error: message };
  }
}

// ── getPaymentOrderAction ─────────────────────────────────────────────────

/**
 * Returns order details for the payment page (ownership verified).
 */
export async function getPaymentOrderAction(orderId: string) {
  const session = await verifySession();

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.userId,
    },
    select: {
      id: true,
      status: true,
      amountInPaise: true,
      questionnaire: {
        select: {
          name: true,
          fitnessGoal: true,
          foodPreference: true,
        },
      },
      payment: {
        select: {
          utrNumber: true,
          status: true,
          rejectionReason: true,
        },
      },
    },
  });

  return order;
}
