import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_SECRET
    ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!
    : "",
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const PRODUCT_PRICE_PAISE = parseInt(
  process.env.NEXT_PUBLIC_PRODUCT_PRICE_PAISE ?? "1900",
  10
);

/**
 * Create a Razorpay order.
 */
export async function createRazorpayOrder(
  amountInPaise: number,
  receiptId: string
) {
  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: receiptId,
    payment_capture: true,
  });
  return order;
}

/**
 * Verify Razorpay payment signature (client-side verification).
 * NOTE: This is a secondary check — always trust the webhook for order fulfillment.
 */
export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const { orderId, paymentId, signature } = params;
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

/**
 * Verify Razorpay webhook signature.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  return expectedSignature === signature;
}
