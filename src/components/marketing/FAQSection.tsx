"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What exactly will I receive?",
    a: "You'll receive a personalized PDF diet plan tailored to your body stats, fitness goals, food preferences, and daily routine. It includes a full day meal plan (breakfast, lunch, dinner, snacks) using Indian foods.",
  },
  {
    q: "How is this different from a generic diet chart?",
    a: "This plan is built specifically for YOU. Based on your questionnaire, we account for your fitness goal, food preferences (veg/non-veg/vegan/jain), medical conditions like PCOS or diabetes, and your daily schedule.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, and Net Banking — all via Razorpay, India's most trusted payment gateway.",
  },
  {
    q: "How long does delivery take?",
    a: "Your personalized diet plan will be uploaded to your dashboard within 24 hours of payment. You'll be notified when it's ready to download.",
  },
  {
    q: "Can I get a refund?",
    a: "Since this is a personalized digital product created specifically for you, we generally don't offer refunds. However, if there's an issue with your plan, contact us and we'll make it right.",
  },
  {
    q: "Do I need to login to get the plan?",
    a: "Yes, you'll create a free account using your phone number (OTP verification). This lets us securely deliver your PDF to your personal dashboard.",
  },
  {
    q: "Is this suitable for medical conditions like PCOS or diabetes?",
    a: "Yes! Our questionnaire has a section for medical conditions. Your plan will be designed accordingly. However, always consult your doctor for serious conditions.",
  },
  {
    q: "Can I get a plan for weight loss, muscle gain, etc.?",
    a: "Absolutely. We support all major goals: weight loss, weight gain, muscle gain, fat loss, healthy lifestyle, PCOS management, diabetes-friendly, and thyroid management.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#1e1e1e] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-white font-medium text-sm pr-4 group-hover:text-[#f5f5f5]">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "text-[#5a5a5a] flex-shrink-0 transition-transform duration-300",
            open && "rotate-180 text-[#c41e3a]"
          )}
        />
      </button>
      {open && (
        <p className="text-[#a0a0a0] text-sm leading-relaxed pb-5 animate-fade-in">
          {a}
        </p>
      )}
    </div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="section bg-[#0a0a0a]" aria-label="FAQ">
      <div className="container">
        <div className="text-center mb-14">
          <div className="divider-red mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#a0a0a0] text-lg max-w-xl mx-auto">
            Everything you need to know before getting your plan.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card p-2 md:p-6">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
