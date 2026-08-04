"use client";

import { type UseFormReturn } from "react-hook-form";
import { FITNESS_GOALS, FOOD_PREFERENCES } from "@/lib/constants";
import { StepNav } from "@/components/questionnaire/StepNav";
import type { QuestionnaireFormData } from "@/lib/validations";

interface Props {
  form: UseFormReturn<QuestionnaireFormData>;
  onBack: () => void;
  onNext: () => void;
}

export function Step2Goals({ form, onBack, onNext }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="card p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-white font-bold text-2xl mb-2">
          Your Goals & Preferences
        </h2>
        <p className="text-[#5a5a5a] text-sm">
          What are you trying to achieve and what kind of food do you prefer?
        </p>
      </div>

      <div className="space-y-6">
        {/* Fitness Goal */}
        <div>
          <label htmlFor="q-fitnessGoal" className="form-label">
            Primary Fitness Goal *
          </label>
          <select
            id="q-fitnessGoal"
            className={`input-base ${errors.fitnessGoal ? "border-[#c41e3a]/60" : ""}`}
            {...register("fitnessGoal")}
          >
            <option value="">Select Goal</option>
            {FITNESS_GOALS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
          {errors.fitnessGoal && (
            <p className="form-error">{errors.fitnessGoal.message}</p>
          )}
        </div>

        {/* Food Preference */}
        <div>
          <label htmlFor="q-foodPreference" className="form-label">
            Dietary Preference *
          </label>
          <select
            id="q-foodPreference"
            className={`input-base ${errors.foodPreference ? "border-[#c41e3a]/60" : ""}`}
            {...register("foodPreference")}
          >
            <option value="">Select Dietary Preference</option>
            {FOOD_PREFERENCES.map((fp) => (
              <option key={fp.value} value={fp.value}>
                {fp.label}
              </option>
            ))}
          </select>
          {errors.foodPreference && (
            <p className="form-error">{errors.foodPreference.message}</p>
          )}
        </div>
      </div>

      <StepNav step={2} totalSteps={5} onBack={onBack} onNext={onNext} />
    </div>
  );
}
