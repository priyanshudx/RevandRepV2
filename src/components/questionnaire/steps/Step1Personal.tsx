"use client";

import { type UseFormReturn } from "react-hook-form";
import { INDIAN_STATES } from "@/lib/constants";
import { StepNav } from "@/components/questionnaire/StepNav";
import type { QuestionnaireFormData } from "@/lib/validations";

interface Props {
  form: UseFormReturn<QuestionnaireFormData>;
  onNext: () => void;
}

const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export function Step1Personal({ form, onNext }: Props) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="card p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-white font-bold text-2xl mb-2">
          Personal Information
        </h2>
        <p className="text-[#5a5a5a] text-sm">
          Help us understand your body so we can craft the right plan.
        </p>
      </div>

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label htmlFor="q-name" className="form-label">
            Full Name *
          </label>
          <input
            id="q-name"
            type="text"
            className={`input-base ${errors.name ? "border-[#c41e3a]/60" : ""}`}
            {...register("name")}
          />
          {errors.name && (
            <p className="form-error">{errors.name.message}</p>
          )}
        </div>

        {/* Age + Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="q-age" className="form-label">
              Age *
            </label>
            <input
              id="q-age"
              type="number"
              min={10}
              max={100}
              className={`input-base ${errors.age ? "border-[#c41e3a]/60" : ""}`}
              {...register("age", { valueAsNumber: true })}
            />
            {errors.age && (
              <p className="form-error">{errors.age.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="q-gender" className="form-label">
              Gender *
            </label>
            <select
              id="q-gender"
              className={`input-base ${errors.gender ? "border-[#c41e3a]/60" : ""}`}
              {...register("gender")}
            >
              <option value="">Select</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="form-error">{errors.gender.message}</p>
            )}
          </div>
        </div>

        {/* Height + Weight */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="q-height" className="form-label">
              Height (cm) *
            </label>
            <input
              id="q-height"
              type="number"
              className={`input-base ${errors.heightCm ? "border-[#c41e3a]/60" : ""}`}
              {...register("heightCm", { valueAsNumber: true })}
            />
            {errors.heightCm && (
              <p className="form-error">{errors.heightCm.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="q-weight" className="form-label">
              Weight (kg) *
            </label>
            <input
              id="q-weight"
              type="number"
              step="0.1"
              className={`input-base ${errors.weightKg ? "border-[#c41e3a]/60" : ""}`}
              {...register("weightKg", { valueAsNumber: true })}
            />
            {errors.weightKg && (
              <p className="form-error">{errors.weightKg.message}</p>
            )}
          </div>
        </div>

        {/* City + State */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="q-city" className="form-label">
              City *
            </label>
            <input
              id="q-city"
              type="text"
              className={`input-base ${errors.city ? "border-[#c41e3a]/60" : ""}`}
              {...register("city")}
            />
            {errors.city && (
              <p className="form-error">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="q-state" className="form-label">
              State *
            </label>
            <select
              id="q-state"
              className={`input-base ${errors.state ? "border-[#c41e3a]/60" : ""}`}
              {...register("state")}
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="form-error">{errors.state.message}</p>
            )}
          </div>
        </div>
      </div>

      <StepNav step={1} totalSteps={5} onNext={onNext} />
    </div>
  );
}
