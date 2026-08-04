"use server";

import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/services/prisma";
import { questionnaireSchema } from "@/lib/validations";
import { PRODUCT } from "@/lib/constants";
import type { QuestionnaireFormData } from "@/lib/validations";

// ── submitQuestionnaireAction ─────────────────────────────────────────────

/**
 * Validates questionnaire data, creates an Order + Questionnaire in the DB,
 * and redirects to the payment page.
 *
 * No Razorpay order is created here — manual UPI payment is collected next.
 * When migrating to Razorpay later, add a Razorpay order creation call here
 * and store the returned order ID in the `razorpayOrderId` field.
 */
export async function submitQuestionnaireAction(
  data: QuestionnaireFormData
): Promise<{ success: false; error: string }> {
  // 1. Verify the user is authenticated
  const session = await verifySession();

  // 2. Validate the incoming data against the full questionnaire schema
  const parsed = questionnaireSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? "Invalid form data.";
    return { success: false, error: firstError };
  }

  const formData = parsed.data;

  let orderId: string;
  try {
    // 3. Create Order + Questionnaire in a single Prisma transaction
    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        amountInPaise: PRODUCT.priceInPaise,
        status: "QUESTIONNAIRE_SUBMITTED",
        razorpayOrderId: null,
        questionnaire: {
          create: {
            userId: session.userId,
            // Personal
            name: formData.name,
            age: formData.age,
            gender: formData.gender,
            heightCm: formData.heightCm,
            weightKg: formData.weightKg,
            city: formData.city,
            state: formData.state,
            // Goals & preferences
            fitnessGoal: formData.fitnessGoal,
            foodPreference: formData.foodPreference,
            // Multi-select arrays
            stapleFoods: formData.stapleFoods,
            proteinSources: formData.proteinSources,
            vegetables: formData.vegetables,
            fruits: formData.fruits,
            snacks: formData.snacks,
            drinks: formData.drinks,
            medicalConditions: formData.medicalConditions ?? [],
            // Routine
            wakeUpTime: formData.wakeUpTime,
            sleepTime: formData.sleepTime,
            workTimings: formData.workTimings,
            workType: formData.workType,
            exercise: formData.exercise,
            // Optional free-text
            allergies: formData.allergies ?? null,
            favouriteFoods: formData.favouriteFoods ?? null,
            hatedFoods: formData.hatedFoods ?? null,
            additionalNotes: formData.additionalNotes ?? null,
          },
        },
      },
      select: { id: true },
    });
    orderId = order.id;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong. Please try again.";
    console.error("[submitQuestionnaireAction]", message);
    return { success: false, error: message };
  }

  // 4. Redirect to UPI payment page (outside try/catch so Next.js redirect works)
  redirect(`/payment?orderId=${orderId}`);
}
