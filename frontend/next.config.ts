import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL ?? "https://api.loslc.tech"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
