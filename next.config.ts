import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma requires native bindings — mark as external for server bundles
  serverExternalPackages: ["@prisma/client", "prisma"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
    ],
  },

  // Enable server actions body size limit up to 10MB (for PDF & screenshot uploads)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // Enable strict mode for React 19
  reactStrictMode: true,
};

export default nextConfig;
