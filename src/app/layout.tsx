import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rev & Rep — Personalized Indian Diet Plan",
    template: "%s | Rev & Rep",
  },
  description:
    "Get your personalized Indian diet plan based on your goals, lifestyle, and eating habits. Only ₹19. Delivered within 24 hours.",
  keywords: [
    "diet plan India",
    "Indian diet plan",
    "weight loss India",
    "nutrition plan",
    "personalized diet",
    "Indian food diet",
    "fitness nutrition India",
  ],
  authors: [{ name: "Rev & Rep" }],
  creator: "Rev & Rep",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Rev & Rep",
    title: "Rev & Rep — Personalized Indian Diet Plan",
    description:
      "Get your personalized Indian diet plan. Only ₹19. Delivered within 24 hours.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rev & Rep — Personalized Indian Diet Plan",
    description: "Get your personalized Indian diet plan. Only ₹19.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${bebasNeue.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "var(--surface-elevated)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "14px",
                },
              }}
            />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
