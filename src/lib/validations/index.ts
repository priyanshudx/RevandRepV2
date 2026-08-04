import { z } from "zod";

// ── Auth ───────────────────────────────────────────────────────────────────

export const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address");

export const pinSchema = z
  .string()
  .trim()
  .min(6, "Pass PIN must be at least 6 characters");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name is too long");

export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    pin: pinSchema,
    confirmPin: pinSchema,
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "Pass PINs do not match",
    path: ["confirmPin"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  pin: pinSchema,
});

export const forgotPinSchema = z.object({
  email: emailSchema,
});

export const resetPinSchema = z
  .object({
    pin: pinSchema,
    confirmPin: pinSchema,
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "Pass PINs do not match",
    path: ["confirmPin"],
  });

// Helper for user-friendly enum error messages (e.g. when empty string is selected)
function customEnum<U extends string, T extends [U, ...U[]]>(
  values: T,
  errorMessage: string
) {
  return z.enum(values, {
    errorMap: (issue, ctx) => {
      if (
        issue.code === "invalid_enum_value" ||
        issue.code === "invalid_type"
      ) {
        return { message: errorMessage };
      }
      return { message: ctx.defaultError };
    },
  });
}

// ── Questionnaire ──────────────────────────────────────────────────────────

export const personalInfoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  age: z
    .number({ invalid_type_error: "Enter a valid age" })
    .int()
    .min(10, "Must be at least 10 years old")
    .max(100, "Enter a valid age"),
  gender: customEnum(["MALE", "FEMALE", "OTHER"], "Please select your gender"),
  heightCm: z
    .number({ invalid_type_error: "Enter a valid height" })
    .int()
    .min(100, "Height must be at least 100 cm")
    .max(250, "Height must be at most 250 cm"),
  weightKg: z
    .number({ invalid_type_error: "Enter a valid weight" })
    .min(20, "Weight must be at least 20 kg")
    .max(300, "Weight must be at most 300 kg"),
  city: z.string().trim().min(2, "Enter a valid city"),
  state: z.string().trim().min(2, "Please select a state"),
});

export const goalsSchema = z.object({
  fitnessGoal: customEnum(
    [
      "WEIGHT_LOSS",
      "WEIGHT_GAIN",
      "MUSCLE_GAIN",
      "FAT_LOSS",
      "HEALTHY_LIFESTYLE",
      "PCOS",
      "DIABETES",
      "THYROID",
    ],
    "Please select a fitness goal"
  ),
  foodPreference: customEnum(
    ["VEGETARIAN", "EGGETARIAN", "NON_VEGETARIAN", "VEGAN", "JAIN"],
    "Please select a food preference"
  ),
});

export const foodChoicesSchema = z.object({
  stapleFoods: z
    .array(z.string())
    .min(1, "Select at least one staple food"),
  proteinSources: z
    .array(z.string())
    .min(1, "Select at least one protein source"),
  vegetables: z.array(z.string()).min(1, "Select at least one vegetable"),
  fruits: z.array(z.string()).min(1, "Select at least one fruit"),
  snacks: z.array(z.string()).default([]),
  drinks: z.array(z.string()).min(1, "Select at least one drink"),
});

export const routineSchema = z.object({
  wakeUpTime: z.string().min(1, "Select wake up time"),
  sleepTime: z.string().min(1, "Select sleep time"),
  workTimings: z.string().min(1, "Enter work timings"),
  workType: customEnum(
    ["STUDENT", "OFFICE", "WORK_FROM_HOME"],
    "Please select work type"
  ),
  exercise: customEnum(
    ["NONE", "WALKING", "RUNNING", "GYM", "YOGA", "HOME_WORKOUT"],
    "Please select exercise type"
  ),
  medicalConditions: z.array(z.string()).default([]),
});

export const additionalInfoSchema = z.object({
  allergies: z.string().trim().max(500).optional(),
  favouriteFoods: z.string().trim().max(500).optional(),
  hatedFoods: z.string().trim().max(500).optional(),
  additionalNotes: z.string().trim().max(1000).optional(),
});

export const questionnaireSchema = personalInfoSchema
  .merge(goalsSchema)
  .merge(foodChoicesSchema)
  .merge(routineSchema)
  .merge(additionalInfoSchema);

export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>;
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type GoalsData = z.infer<typeof goalsSchema>;
export type FoodChoicesData = z.infer<typeof foodChoicesSchema>;
export type RoutineData = z.infer<typeof routineSchema>;
export type AdditionalInfoData = z.infer<typeof additionalInfoSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPinFormData = z.infer<typeof forgotPinSchema>;
export type ResetPinFormData = z.infer<typeof resetPinSchema>;
