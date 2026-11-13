import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-964aaf148d3f409d99da8fedff2d543c.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
