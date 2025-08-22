import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force rebuild by changing build ID
  generateBuildId: async () => {
    return `build-${Date.now()}`
  }
};

export default nextConfig;
