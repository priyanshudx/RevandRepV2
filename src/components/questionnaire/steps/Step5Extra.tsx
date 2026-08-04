"use client";

import { type UseFormReturn } from "react-hook-form";
import { StepNav } from "@/components/questionnaire/StepNav";
import type { QuestionnaireFormData } from "@/lib/validations";

interface Props {
  form: UseFormReturn<QuestionnaireFormData>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function Step5Extra({ form, onBack, onSubmit, isSubmitting }: Props) {
  const { register } = form;

  return (
    <div className="card p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-white font-bold text-2xl mb-2">
          Extra Details & Notes
        </h2>
        <p className="text-[#5a5a5a] text-sm">
          Any specific food preferences, allergies, or notes for your dietitian? (Optional)
        </p>
      </div>

      <div className="space-y-5">
        {/* Food Allergies */}
        <div>
          <label htmlFor="q-allergies" className="form-label">
            Food Allergies / Intolerances
          </label>
          <input
            id="q-allergies"
            type="text"
            className="input-base"
            {...register("allergies")}
          />
        </div>

        {/* Favourite Foods */}
        <div>
          <label htmlFor="q-favouriteFoods" className="form-label">
            Favourite Foods (Must-haves in diet if possible)
          </label>
          <input
            id="q-favouriteFoods"
            type="text"
            className="input-base"
            {...register("favouriteFoods")}
          />
        </div>

        {/* Hated Foods */}
        <div>
          <label htmlFor="q-hatedFoods" className="form-label">
            Foods You Dislike / Want to Avoid
          </label>
          <input
            id="q-hatedFoods"
            type="text"
            className="input-base"
            {...register("hatedFoods")}
          />
        </div>

        {/* Special Instructions */}
        <div>
          <label htmlFor="q-additionalNotes" className="form-label">
            Additional Notes for Dietitian
          </label>
          <textarea
            id="q-additionalNotes"
            rows={3}
            className="input-base resize-none"
            {...register("additionalNotes")}
          />
        </div>
      </div>

      <StepNav
        step={5}
        totalSteps={5}
        onBack={onBack}
        onNext={onSubmit}
        isLastStep
        isSubmitting={isSubmitting}
        nextLabel="Submit & Pay ₹19"
      />
    </div>
  );
}
