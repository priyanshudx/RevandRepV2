"use client";

import { type UseFormReturn, useWatch } from "react-hook-form";
import {
  WORK_TYPES,
  EXERCISE_TYPES,
  MEDICAL_CONDITIONS,
} from "@/lib/constants";
import { StepNav } from "@/components/questionnaire/StepNav";
import type { QuestionnaireFormData } from "@/lib/validations";

interface Props {
  form: UseFormReturn<QuestionnaireFormData>;
  onBack: () => void;
  onNext: () => void;
}

export function Step4Routine({ form, onBack, onNext }: Props) {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = form;

  const medicalConditions = useWatch({ control, name: "medicalConditions" }) ?? [];

  function toggleCondition(condition: string) {
    const current = (form.getValues("medicalConditions") as string[]) ?? [];
    if (condition === "None") {
      setValue("medicalConditions", ["None"], { shouldValidate: true });
      return;
    }
    const filtered = current.filter((c) => c !== "None");
    if (filtered.includes(condition)) {
      setValue(
        "medicalConditions",
        filtered.filter((c) => c !== condition),
        { shouldValidate: true }
      );
    } else {
      setValue("medicalConditions", [...filtered, condition], {
        shouldValidate: true,
      });
    }
  }

  return (
    <div className="card p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-white font-bold text-2xl mb-2">
          Daily Routine & Health
        </h2>
        <p className="text-[#5a5a5a] text-sm">
          Understanding your schedule helps us recommend realistic meal timings.
        </p>
      </div>

      <div className="space-y-5">
        {/* Wake Up + Sleep Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="q-wakeUpTime" className="form-label">
              Wake Up Time *
            </label>
            <input
              id="q-wakeUpTime"
              type="text"
              className={`input-base ${errors.wakeUpTime ? "border-[#c41e3a]/60" : ""}`}
              {...register("wakeUpTime")}
            />
            {errors.wakeUpTime && (
              <p className="form-error">{errors.wakeUpTime.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="q-sleepTime" className="form-label">
              Sleep Time *
            </label>
            <input
              id="q-sleepTime"
              type="text"
              className={`input-base ${errors.sleepTime ? "border-[#c41e3a]/60" : ""}`}
              {...register("sleepTime")}
            />
            {errors.sleepTime && (
              <p className="form-error">{errors.sleepTime.message}</p>
            )}
          </div>
        </div>

        {/* Work Type + Work Timings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="q-workType" className="form-label">
              Occupation Type *
            </label>
            <select
              id="q-workType"
              className={`input-base ${errors.workType ? "border-[#c41e3a]/60" : ""}`}
              {...register("workType")}
            >
              <option value="">Select Work Type</option>
              {WORK_TYPES.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
            {errors.workType && (
              <p className="form-error">{errors.workType.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="q-workTimings" className="form-label">
              Work Hours *
            </label>
            <input
              id="q-workTimings"
              type="text"
              className={`input-base ${errors.workTimings ? "border-[#c41e3a]/60" : ""}`}
              {...register("workTimings")}
            />
            {errors.workTimings && (
              <p className="form-error">{errors.workTimings.message}</p>
            )}
          </div>
        </div>

        {/* Exercise Activity */}
        <div>
          <label htmlFor="q-exercise" className="form-label">
            Exercise / Activity *
          </label>
          <select
            id="q-exercise"
            className={`input-base ${errors.exercise ? "border-[#c41e3a]/60" : ""}`}
            {...register("exercise")}
          >
            <option value="">Select Exercise Routine</option>
            {EXERCISE_TYPES.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
          {errors.exercise && (
            <p className="form-error">{errors.exercise.message}</p>
          )}
        </div>

        {/* Medical Conditions */}
        <div>
          <label className="form-label">Medical Conditions / Health Concerns</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {MEDICAL_CONDITIONS.map((cond) => {
              const selected = medicalConditions.includes(cond);
              return (
                <button
                  type="button"
                  key={cond}
                  onClick={() => toggleCondition(cond)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selected
                      ? "bg-[#c41e3a] border-[#c41e3a] text-white"
                      : "bg-[#1a1a1a] border-[#2a2a2a] text-[#a0a0a0] hover:border-[#3a3a3a]"
                  }`}
                >
                  {cond}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <StepNav step={4} totalSteps={5} onBack={onBack} onNext={onNext} />
    </div>
  );
}
