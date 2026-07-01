import path from "node:path";
import type { NextConfig } from "next";

const threeShim = path.resolve(__dirname, "lib/three-shim.ts");

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      three: "./lib/three-shim.ts",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      three: threeShim,
    };
    return config;
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons/si",
      "react-icons/fa6",
      "react-icons/tb",
      "framer-motion",
      "@react-three/fiber",
      "@react-three/drei",
      "three",
      "react-hook-form",
      "zod",
      "@hookform/resolvers",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
