"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface StepNavProps {
  step: number;
  totalSteps: number;
  onBack?: () => void;
  onNext?: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  nextLabel?: string;
}

export function StepNav({
  step,
  totalSteps,
  onBack,
  onNext,
  isLastStep = false,
  isSubmitting = false,
  nextLabel,
}: StepNavProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#1e1e1e]">
      {/* Back button */}
      {step > 1 ? (
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="btn-ghost py-2.5 px-4 text-sm"
          id={`step-${step}-back`}
        >
          <ChevronLeft size={16} />
          Back
        </button>
      ) : (
        <div />
      )}

      {/* Next / Submit button */}
      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="btn-primary"
        id={`step-${step}-next`}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting…
          </>
        ) : isLastStep ? (
          <>
            {nextLabel ?? "Submit & Continue to Payment"}
            <ChevronRight size={16} />
          </>
        ) : (
          <>
            {nextLabel ?? "Next Step"}
            <ChevronRight size={16} />
          </>
        )}
      </button>
    </div>
  );
}
