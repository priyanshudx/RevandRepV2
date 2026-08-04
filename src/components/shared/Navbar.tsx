"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { Logo } from "@/components/shared/Logo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#080808]/90 backdrop-blur-md border-b border-[#1e1e1e]"
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <Logo size={40} />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[#a0a0a0] hover:text-white text-sm font-medium transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={ROUTES.login}
            className="text-[#a0a0a0] hover:text-white text-sm font-medium transition-colors"
            id="nav-login"
          >
            Login
          </Link>
          <Link
            href={ROUTES.signup}
            className="btn-primary text-sm py-2.5 px-5"
            id="nav-cta"
          >
            Get My Plan – ₹19
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="nav-mobile-toggle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1e1e1e] bg-[#080808]/95 backdrop-blur-md animate-fade-in">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[#a0a0a0] hover:text-white text-sm font-medium py-2 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="divider" />
            <div className="flex flex-col gap-2">
              <Link
                href={ROUTES.login}
                onClick={() => setMobileOpen(false)}
                className="btn-ghost text-sm text-center py-2 text-[#a0a0a0] hover:text-white"
                id="nav-mobile-login"
              >
                Login
              </Link>
              <Link
                href={ROUTES.signup}
                onClick={() => setMobileOpen(false)}
                className="btn-primary text-sm text-center"
                id="nav-mobile-cta"
              >
                Get My Plan – ₹19
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
