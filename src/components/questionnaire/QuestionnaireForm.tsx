"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { questionnaireSchema, type QuestionnaireFormData } from "@/lib/validations";
import { submitQuestionnaireAction } from "@/actions/questionnaire";
import { Step1Personal } from "@/components/questionnaire/steps/Step1Personal";
import { Step2Goals } from "@/components/questionnaire/steps/Step2Goals";
import { Step3FoodChoices } from "@/components/questionnaire/steps/Step3FoodChoices";
import { Step4Routine } from "@/components/questionnaire/steps/Step4Routine";
import { Step5Extra } from "@/components/questionnaire/steps/Step5Extra";

const STORAGE_KEY = "rev_rep_questionnaire_draft";

const STEPS = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Your Goals" },
  { id: 3, label: "Food Choices" },
  { id: 4, label: "Daily Routine" },
  { id: 5, label: "Extra Info" },
];

export function QuestionnaireForm() {
  const [activeStep, setActiveStep] = useState(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireSchema) as any,
    defaultValues: {
      name: "",
      age: "" as any,
      gender: "" as any,
      heightCm: "" as any,
      weightKg: "" as any,
      city: "",
      state: "",
      fitnessGoal: "" as any,
      foodPreference: "" as any,
      stapleFoods: [],
      proteinSources: [],
      vegetables: [],
      fruits: [],
      snacks: [],
      drinks: [],
      wakeUpTime: "",
      sleepTime: "",
      workType: "" as any,
      workTimings: "",
      exercise: "" as any,
      medicalConditions: [],
      allergies: "",
      favouriteFoods: "",
      hatedFoods: "",
      additionalNotes: "",
    },
    mode: "onTouched",
  });

  // Force clear any old stored draft from browser storage on mount
  useEffect(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  // Step-by-step validation rules before advancing
  async function handleNextStep() {
    let isValid = false;
    if (activeStep === 1) {
      isValid = await form.trigger(["name", "age", "gender", "heightCm", "weightKg", "city", "state"]);
    } else if (activeStep === 2) {
      isValid = await form.trigger(["fitnessGoal", "foodPreference"]);
    } else if (activeStep === 3) {
      isValid = await form.trigger(["stapleFoods", "proteinSources", "vegetables", "fruits", "drinks"]);
    } else if (activeStep === 4) {
      isValid = await form.trigger(["wakeUpTime", "sleepTime", "workType", "workTimings", "exercise"]);
    } else {
      isValid = true;
    }

    if (isValid) {
      setServerError(null);
      setActiveStep((prev) => Math.min(STEPS.length, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBackStep() {
    setServerError(null);
    setActiveStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Final Form Submission
  async function handleSubmitForm() {
    const isValid = await form.trigger();
    if (!isValid) return;

    setServerError(null);
    startTransition(async () => {
      const formData = form.getValues();
      const res = await submitQuestionnaireAction(formData);

      if (res && !res.success) {
        setServerError(res.error);
      } else {
        // Clear saved draft on success
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Ignore
        }
      }
    });
  }

  return (
    <div className="container py-10 max-w-2xl">
      {/* Step Indicators */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3 overflow-x-auto pb-1">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step.id === activeStep
                      ? "bg-[#c41e3a] text-white shadow-lg shadow-[#c41e3a]/30"
                      : step.id < activeStep
                      ? "bg-[#3a0a14] border border-[#c41e3a] text-[#c41e3a]"
                      : "bg-[#1a1a1a] border border-[#2a2a2a] text-[#5a5a5a]"
                  }`}
                >
                  {step.id < activeStep ? "✓" : step.id}
                </div>
                <span
                  className={`text-[10px] mt-1 whitespace-nowrap font-medium ${
                    step.id === activeStep ? "text-white" : "text-[#5a5a5a]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-[1px] w-8 md:w-16 mx-2 mb-4 transition-all ${
                    step.id < activeStep ? "bg-[#c41e3a]" : "bg-[#1e1e1e]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 rounded-full bg-[#1e1e1e] overflow-hidden">
          <div
            className="h-full bg-[#c41e3a] rounded-full transition-all duration-500"
            style={{ width: `${(activeStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Server Error Banner */}
      {serverError && (
        <div className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-[rgba(196,30,58,0.1)] border border-[rgba(196,30,58,0.3)] text-[#c41e3a]">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium">{serverError}</p>
        </div>
      )}

      {/* Active Step Render */}
      {activeStep === 1 && <Step1Personal form={form} onNext={handleNextStep} />}
      {activeStep === 2 && (
        <Step2Goals form={form} onBack={handleBackStep} onNext={handleNextStep} />
      )}
      {activeStep === 3 && (
        <Step3FoodChoices form={form} onBack={handleBackStep} onNext={handleNextStep} />
      )}
      {activeStep === 4 && (
        <Step4Routine form={form} onBack={handleBackStep} onNext={handleNextStep} />
      )}
      {activeStep === 5 && (
        <Step5Extra
          form={form}
          onBack={handleBackStep}
          onSubmit={handleSubmitForm}
          isSubmitting={isPending}
        />
      )}

      <p className="text-[#3a3a3a] text-xs text-center mt-6">
        Your information is private and used strictly to craft your personalized diet plan.
      </p>
    </div>
  );
}
