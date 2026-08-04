import Link from "next/link";
import { Share2, MessageCircle } from "lucide-react";
import { APP_NAME, APP_TAGLINE, ROUTES } from "@/lib/constants";
import { Logo } from "@/components/shared/Logo";

const footerLinks = {
  product: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  account: [
    { label: "Login", href: ROUTES.login },
    { label: "My Dashboard", href: ROUTES.dashboard },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" },
  ],
};

export function Footer() {
  return (
    <footer
      className="border-t border-[#1e1e1e] bg-[#080808]"
      aria-label="Site footer"
    >
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-3">
              <Logo size={40} />
            </div>
            <p className="text-[#5a5a5a] text-sm leading-relaxed mb-5">
              {APP_TAGLINE}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/revandrep"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-[#2a2a2a] flex items-center justify-center text-[#5a5a5a] hover:text-white hover:border-[#3d3d3d] transition-colors"
                aria-label="Instagram"
              >
                <Share2 size={16} />
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-[#2a2a2a] flex items-center justify-center text-[#5a5a5a] hover:text-white hover:border-[#3d3d3d] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#5a5a5a] hover:text-[#a0a0a0] text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">
              Account
            </h3>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#5a5a5a] hover:text-[#a0a0a0] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[#5a5a5a] hover:text-[#a0a0a0] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider mt-12 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[#3a3a3a] text-xs">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-[#3a3a3a] text-xs">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
