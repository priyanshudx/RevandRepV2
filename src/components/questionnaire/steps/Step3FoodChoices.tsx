"use client";

import { type UseFormReturn, useWatch } from "react-hook-form";
import {
  STAPLE_FOODS,
  PROTEIN_SOURCES,
  VEGETABLES,
  FRUITS,
  SNACKS,
  DRINKS,
} from "@/lib/constants";
import { StepNav } from "@/components/questionnaire/StepNav";
import type { QuestionnaireFormData } from "@/lib/validations";

interface Props {
  form: UseFormReturn<QuestionnaireFormData>;
  onBack: () => void;
  onNext: () => void;
}

export function Step3FoodChoices({ form, onBack, onNext }: Props) {
  const {
    setValue,
    control,
    formState: { errors },
  } = form;

  const stapleFoods = useWatch({ control, name: "stapleFoods" }) ?? [];
  const proteinSources = useWatch({ control, name: "proteinSources" }) ?? [];
  const vegetables = useWatch({ control, name: "vegetables" }) ?? [];
  const fruits = useWatch({ control, name: "fruits" }) ?? [];
  const snacks = useWatch({ control, name: "snacks" }) ?? [];
  const drinks = useWatch({ control, name: "drinks" }) ?? [];

  function toggleItem(fieldName: keyof QuestionnaireFormData, value: string) {
    const currentList = (form.getValues(fieldName) as string[]) ?? [];
    if (currentList.includes(value)) {
      setValue(
        fieldName,
        currentList.filter((item) => item !== value) as any,
        { shouldValidate: true }
      );
    } else {
      setValue(fieldName, [...currentList, value] as any, {
        shouldValidate: true,
      });
    }
  }

  return (
    <div className="card p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-white font-bold text-2xl mb-2">
          Daily Food Choices
        </h2>
        <p className="text-[#5a5a5a] text-sm">
          Select what you regularly eat so we can build your plan around your tastes.
        </p>
      </div>

      <div className="space-y-6">
        {/* Staple Foods */}
        <div>
          <label className="form-label">Staple Foods (Select all that apply) *</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {STAPLE_FOODS.map((item) => {
              const selected = stapleFoods.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleItem("stapleFoods", item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selected
                      ? "bg-[#c41e3a] border-[#c41e3a] text-white"
                      : "bg-[#1a1a1a] border-[#2a2a2a] text-[#a0a0a0] hover:border-[#3a3a3a]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          {errors.stapleFoods && (
            <p className="form-error">{errors.stapleFoods.message}</p>
          )}
        </div>

        {/* Protein Sources */}
        <div>
          <label className="form-label">Protein Sources (Select all that apply) *</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {PROTEIN_SOURCES.map((item) => {
              const selected = proteinSources.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleItem("proteinSources", item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selected
                      ? "bg-[#c41e3a] border-[#c41e3a] text-white"
                      : "bg-[#1a1a1a] border-[#2a2a2a] text-[#a0a0a0] hover:border-[#3a3a3a]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          {errors.proteinSources && (
            <p className="form-error">{errors.proteinSources.message}</p>
          )}
        </div>

        {/* Vegetables */}
        <div>
          <label className="form-label">Vegetables (Select all that apply) *</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {VEGETABLES.map((item) => {
              const selected = vegetables.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleItem("vegetables", item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selected
                      ? "bg-[#c41e3a] border-[#c41e3a] text-white"
                      : "bg-[#1a1a1a] border-[#2a2a2a] text-[#a0a0a0] hover:border-[#3a3a3a]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          {errors.vegetables && (
            <p className="form-error">{errors.vegetables.message}</p>
          )}
        </div>

        {/* Fruits */}
        <div>
          <label className="form-label">Fruits (Select all that apply) *</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {FRUITS.map((item) => {
              const selected = fruits.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleItem("fruits", item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selected
                      ? "bg-[#c41e3a] border-[#c41e3a] text-white"
                      : "bg-[#1a1a1a] border-[#2a2a2a] text-[#a0a0a0] hover:border-[#3a3a3a]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          {errors.fruits && (
            <p className="form-error">{errors.fruits.message}</p>
          )}
        </div>

        {/* Snacks */}
        <div>
          <label className="form-label">Snacks (Optional)</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {SNACKS.map((item) => {
              const selected = snacks.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleItem("snacks", item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selected
                      ? "bg-[#c41e3a] border-[#c41e3a] text-white"
                      : "bg-[#1a1a1a] border-[#2a2a2a] text-[#a0a0a0] hover:border-[#3a3a3a]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Drinks */}
        <div>
          <label className="form-label">Daily Beverages *</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {DRINKS.map((item) => {
              const selected = drinks.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleItem("drinks", item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selected
                      ? "bg-[#c41e3a] border-[#c41e3a] text-white"
                      : "bg-[#1a1a1a] border-[#2a2a2a] text-[#a0a0a0] hover:border-[#3a3a3a]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          {errors.drinks && (
            <p className="form-error">{errors.drinks.message}</p>
          )}
        </div>
      </div>

      <StepNav step={3} totalSteps={5} onBack={onBack} onNext={onNext} />
    </div>
  );
}
