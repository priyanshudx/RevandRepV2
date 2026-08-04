import { NextResponse } from "next/server";

export async function POST() {
  // Razorpay webhook handler — implemented in Phase 6
  return NextResponse.json({ received: true });
}
