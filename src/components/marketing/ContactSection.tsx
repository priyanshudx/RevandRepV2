import Link from "next/link";
import { Mail } from "lucide-react";
import { BRAND, ROUTES } from "@/lib/constants";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="section bg-[#0a0a0a]"
      aria-label="Contact"
    >
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="divider-red mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
            Have Questions?
          </h2>
          <p className="text-[#a0a0a0] text-lg mb-10">
            We&apos;re here to help. Reach out before or after purchase.
          </p>

          <div className="max-w-md mx-auto mb-10">
            <a
              href={`mailto:${BRAND.supportEmail}`}
              className="card-elevated p-6 flex items-center justify-center gap-4 hover:border-[#c41e3a]/30 transition-colors"
              id="contact-email"
            >
              <div className="w-10 h-10 rounded-lg bg-[#1a0509] border border-[#3a0a14] flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-[#c41e3a]" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Help &amp; Support Email</p>
                <p className="text-[#a0a0a0] text-xs">{BRAND.supportEmail}</p>
              </div>
            </a>
          </div>

          {/* Final CTA */}
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "#141414",
              border: "1px solid #1e1e1e",
            }}
          >
            <p className="text-white font-bold text-xl mb-2">
              Ready to Rev Up?
            </p>
            <p className="text-[#5a5a5a] text-sm mb-6">
              Get your personalized Indian diet plan for just ₹19.
            </p>
            <Link
              href={ROUTES.login}
              className="btn-primary text-base px-8 py-3.5"
              id="contact-final-cta"
            >
              Get My Diet Plan – ₹19
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
