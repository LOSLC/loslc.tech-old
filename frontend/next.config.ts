import type { NextConfig } from "next";

const apiUrl = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`, // Proxy API requests to backend
      },
    ];
  },
};

export default nextConfig;
