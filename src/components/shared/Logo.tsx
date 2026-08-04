import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  href?: string | null;
}

export function Logo({
  className,
  size = 40,
  showText = true,
  href = ROUTES.home,
}: LogoProps) {
  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group cursor-pointer", className)}>
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Rev & Rep Logo"
          className="w-full h-full object-contain rounded-lg transform group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      {showText && (
        <span className="text-white font-bold text-xl tracking-tight leading-none">
          Rev <span className="text-[#c41e3a]">&</span> Rep
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block" id="app-logo-link">
        {content}
      </Link>
    );
  }

  return content;
}
