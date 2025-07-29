import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // ✅ Static export-compatible images
  },
  // output: "export",
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_API_URL: "http://hitcenter-api.test/api",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
